import { Box, Container, List} from '@mui/material';
import Footer from '../../components/footer';
import { MetaContentI } from '../../contentlayer.config';
import PostPreview, { PostPreviewI } from '../../components/post-prev';
import { allPosts } from 'contentlayer/generated';
import HeaderSm from 'components/header-sm';
import { useEffect } from 'react';
import { logVisit } from 'utils/firebase';

export default function HomeApps() {
  useEffect(()=>{
    logVisit("/posts");
  }, []);
  
  let contentList: MetaContentI[] = [...allPosts].map(e => {
    return {
      ...e,
      date: new Date(e.date)
    }
  }) as MetaContentI[];

  contentList.sort((a,b)=>b.date.getTime()-a.date.getTime());

  return (
    <>
      <Container maxWidth="sm">
        <HeaderSm />
        <h2>All Posts</h2>
        <Box>
          <List sx={{ width: '100%' }}>
            {
              contentList.map(e =>
                <PostPreview
                  item={{ ...e, date: e.date.toISOString().substring(2,10) } as PostPreviewI}
                  key={e.url}
                />
              )
            }
          </List>
        </Box>

        <Footer />
      </Container>
    </>
  )
}

