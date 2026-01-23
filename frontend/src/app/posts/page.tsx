import { fetchPosts } from '@/lib/nocodb';
import { PostsPage } from '@/components/pages/posts-page';

export const revalidate = 60;

export default async function Posts() {
  const posts = await fetchPosts();

  return <PostsPage posts={posts} />;
}
