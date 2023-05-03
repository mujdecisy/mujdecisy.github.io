import { allBlogs } from 'contentlayer/generated'
import { ContentI } from '../../contentlayer.config';
import ContentLayout from 'components/content';

export async function getStaticPaths() {
    const paths = allBlogs.map(post => post.url)
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }: { params: any }) {
    const post = allBlogs.find(post => post._raw.flattenedPath === `blog/${params.slug}`)
    return {
        props: {
            post
        }
    }
}

export default function PostLayout({ post }: { post: ContentI }) {
    return (
        <ContentLayout content={post} />
    );
}
