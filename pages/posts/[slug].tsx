import { allPosts } from 'contentlayer/generated'
import { ContentI } from '../../contentlayer.config';
import ContentLayout from 'components/content';
import { useEffect } from 'react';
import { logVisit } from 'utils/firebase';

export async function getStaticPaths() {
    const paths = allPosts.map(post => `${post.url}`)
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }: { params: any }) {
    const post = allPosts.find(post => post._raw.flattenedPath === params.slug)
    return {
        props: {
            post
        }
    }
}

export default function PostLayout({ post }: { post: ContentI }) {
    useEffect(()=>{
        logVisit(`${post.url}`);
    }, []);

    return (
        <ContentLayout content={post} />
    );
}
