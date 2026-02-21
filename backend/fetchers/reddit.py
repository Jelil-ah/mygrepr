"""
Reddit Fetcher - Uses PRAW (authenticated) with fallback to .json endpoint
"""
import time
from datetime import datetime
from typing import Generator
from backend.config import (
    SUBREDDITS, MIN_SCORE, MIN_SCORE_NEW, POSTS_PER_REQUEST, TIME_FILTER,
    REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USER_AGENT, USER_AGENT, logger
)

# Try to initialize PRAW client
_reddit = None
if REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET:
    try:
        import praw
        _reddit = praw.Reddit(
            client_id=REDDIT_CLIENT_ID,
            client_secret=REDDIT_CLIENT_SECRET,
            user_agent=REDDIT_USER_AGENT,
        )
        # Test connection
        _reddit.read_only = True
        logger.info("Reddit API: Using PRAW (authenticated)")
    except Exception as e:
        logger.warning(f"PRAW init failed, falling back to .json endpoint: {e}")
        _reddit = None
else:
    logger.info("Reddit API: Using .json endpoint (no credentials configured)")


def _post_to_dict(post_data: dict, subreddit: str) -> dict:
    """Convert raw post data to our standard dict format."""
    created_utc = post_data.get("created_utc", 0)
    created_at = datetime.utcfromtimestamp(created_utc).strftime("%Y-%m-%d %H:%M:%S") if created_utc else None

    return {
        "id": post_data.get("id"),
        "subreddit": subreddit,
        "title": post_data.get("title"),
        "selftext": (post_data.get("selftext") or "")[:2000],
        "score": post_data.get("score", 0),
        "num_comments": post_data.get("num_comments", 0),
        "created_utc": created_utc,
        "created_at": created_at,
        "url": f"https://reddit.com{post_data.get('permalink')}",
        "author": post_data.get("author"),
        "upvote_ratio": post_data.get("upvote_ratio", 0),
    }


def _praw_post_to_dict(submission, subreddit: str) -> dict:
    """Convert a PRAW Submission object to our standard dict format."""
    created_utc = submission.created_utc
    created_at = datetime.utcfromtimestamp(created_utc).strftime("%Y-%m-%d %H:%M:%S") if created_utc else None

    return {
        "id": submission.id,
        "subreddit": subreddit,
        "title": submission.title,
        "selftext": (submission.selftext or "")[:2000],
        "score": submission.score,
        "num_comments": submission.num_comments,
        "created_utc": created_utc,
        "created_at": created_at,
        "url": f"https://reddit.com{submission.permalink}",
        "author": str(submission.author) if submission.author else "[deleted]",
        "upvote_ratio": submission.upvote_ratio,
    }


def _fetch_praw(subreddit: str, time_filter: str, limit: int, sort: str, min_score: int) -> Generator[dict, None, None]:
    """Fetch posts using PRAW (authenticated Reddit API)."""
    sub = _reddit.subreddit(subreddit)
    total_fetched = 0

    try:
        if sort == "new":
            posts = sub.new(limit=limit)
        elif sort == "hot":
            posts = sub.hot(limit=limit)
        else:  # top
            posts = sub.top(time_filter=time_filter, limit=limit)

        for submission in posts:
            if submission.score >= min_score:
                yield _praw_post_to_dict(submission, subreddit)
                total_fetched += 1
    except Exception as e:
        logger.error(f"PRAW error fetching r/{subreddit}: {e}")

    logger.info(f"  [PRAW] Fetched {total_fetched} posts from r/{subreddit} (score >= {min_score})")


def _fetch_json(subreddit: str, time_filter: str, limit: int, sort: str, min_score: int) -> Generator[dict, None, None]:
    """Fetch posts using .json endpoint (unauthenticated fallback)."""
    import requests

    base_url = f"https://www.reddit.com/r/{subreddit}/{sort}/.json"
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    after = None
    total_fetched = 0

    while total_fetched < limit:
        params = {
            "limit": min(limit - total_fetched, 100),
            "raw_json": 1
        }
        if sort == "top":
            params["t"] = time_filter
        if after:
            params["after"] = after

        try:
            response = requests.get(base_url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching r/{subreddit}: {e}")
            break

        posts = data.get("data", {}).get("children", [])
        if not posts:
            break

        for post in posts:
            post_data = post.get("data", {})
            score = post_data.get("score", 0)

            if score >= min_score:
                yield _post_to_dict(post_data, subreddit)
                total_fetched += 1

        after = data.get("data", {}).get("after")
        if not after:
            break

        time.sleep(2)  # Rate limit - conservative to avoid blocks

    logger.info(f"  [JSON] Fetched {total_fetched} posts from r/{subreddit} (score >= {min_score})")


def fetch_subreddit_posts(subreddit: str, time_filter: str = TIME_FILTER, limit: int = POSTS_PER_REQUEST, sort: str = "top") -> Generator[dict, None, None]:
    """
    Fetch posts from a subreddit. Uses PRAW if configured, otherwise .json endpoint.
    sort: "top", "new", or "hot"
    """
    # Use lower score threshold for new posts
    min_score = MIN_SCORE_NEW if sort == "new" else MIN_SCORE

    if _reddit:
        yield from _fetch_praw(subreddit, time_filter, limit, sort, min_score)
    else:
        yield from _fetch_json(subreddit, time_filter, limit, sort, min_score)


def fetch_top_comment(post_id: str, subreddit: str) -> dict | None:
    """Fetch the top comment for a specific post."""
    if _reddit:
        return _fetch_top_comment_praw(post_id)
    else:
        return _fetch_top_comment_json(post_id, subreddit)


def _fetch_top_comment_praw(post_id: str) -> dict | None:
    """Fetch top comment using PRAW."""
    try:
        submission = _reddit.submission(id=post_id)
        submission.comment_sort = "top"
        submission.comments.replace_more(limit=0)
        if submission.comments:
            comment = submission.comments[0]
            return {
                "comment_id": comment.id,
                "comment_body": (comment.body or "")[:1000],
                "comment_score": comment.score,
                "comment_author": str(comment.author) if comment.author else "[deleted]",
            }
    except Exception as e:
        logger.error(f"PRAW error fetching comment for {post_id}: {e}")
    return None


def _fetch_top_comment_json(post_id: str, subreddit: str) -> dict | None:
    """Fetch top comment using .json endpoint."""
    import requests

    url = f"https://www.reddit.com/r/{subreddit}/comments/{post_id}/.json"
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    params = {"limit": 1, "sort": "top", "raw_json": 1}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if len(data) > 1:
            comments = data[1].get("data", {}).get("children", [])
            if comments and comments[0].get("kind") == "t1":
                comment_data = comments[0].get("data", {})
                return {
                    "comment_id": comment_data.get("id"),
                    "comment_body": (comment_data.get("body") or "")[:1000],
                    "comment_score": comment_data.get("score", 0),
                    "comment_author": comment_data.get("author"),
                }
    except Exception as e:
        logger.error(f"Error fetching comments for {post_id}: {e}")

    return None


def fetch_all_posts(with_comments: bool = True) -> list[dict]:
    """Fetch all posts from all configured subreddits."""
    all_posts = []

    for subreddit in SUBREDDITS:
        logger.info(f"\nFetching r/{subreddit}...")

        for post in fetch_subreddit_posts(subreddit):
            if with_comments:
                top_comment = fetch_top_comment(post["id"], subreddit)
                if top_comment:
                    post.update(top_comment)
                time.sleep(0.5)

            all_posts.append(post)

    logger.info(f"\nTotal: {len(all_posts)} posts fetched")
    return all_posts


# Test
if __name__ == "__main__":
    print(f"Reddit API mode: {'PRAW (authenticated)' if _reddit else '.json (unauthenticated)'}")
    print("Testing reddit_fetcher...")

    for i, post in enumerate(fetch_subreddit_posts("vosfinances", sort="new", limit=10)):
        print(f"\n{i+1}. [{post['score']}] {post['title'][:60]}...")
        if i >= 4:
            break
