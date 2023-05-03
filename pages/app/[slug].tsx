import { allApps } from 'contentlayer/generated'
import { ContentI } from '../../contentlayer.config';
import ContentLayout from 'components/content';

export async function getStaticPaths() {
    const paths = allApps.map(post => post.url)
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }: { params: any }) {
    const post = allApps.find(post => post._raw.flattenedPath === `app/${params.slug}`)
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
