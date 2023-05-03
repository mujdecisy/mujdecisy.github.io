import { allProjects } from 'contentlayer/generated'
import { ContentI } from '../../contentlayer.config';
import ContentLayout from 'components/content';

export async function getStaticPaths() {
    const paths = allProjects.map(post => post.url)
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }: { params: any }) {
    const post = allProjects.find(post => post._raw.flattenedPath === `project/${params.slug}`)
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
