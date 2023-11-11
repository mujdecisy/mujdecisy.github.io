import { Box, Chip, Container, Divider, List, Typography } from '@mui/material';
import Footer from '../components/footer';
import Header from '../components/header';
import { MetaContentI } from '../contentlayer.config';
import PostPreview, { PostPreviewI } from '../components/post-prev';
import { allPosts } from 'contentlayer/generated';
import { useEffect } from 'react';
import { logVisit } from '../utils/firebase';

export interface PostElement {
  navLabel: string
  navHref: string
  color: string
}

export default function Home() {

  useEffect(()=>{
    logVisit("/");
  }, []);
  
  let contentList: MetaContentI[] = [...allPosts].map(e => {
    console.log(e)
    return {
      ...e,
      date: new Date(e.date)
    }
  }) as MetaContentI[];

  contentList.sort((a,b)=>b.date.getTime()-a.date.getTime());
  contentList = contentList.slice(0, 5)

  return (
    <>
      <Container maxWidth="sm">
        <Header />
        <Box sx={{ marginTop: 3, lineHeight: '1.3rem' }}>
          I am a software engineer who loves to work on&nbsp;
          <span className='text-mark'>software architecture</span> and&nbsp;
          <span className='text-mark'>machine learning</span>.
          Sharing my&nbsp;
          <span className='text-mark'>work</span> and&nbsp;
          <span className='text-mark'>thoughts</span>&nbsp;
          motivates me and helps me to evaluate myself.
        </Box>


        <Divider sx={{marginTop: "2rem"}}/>
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1, mt: 3 }}>
          <Chip
            label='All posts'
            component="a"
            href="/posts"
            size="small"
            clickable
            sx={{ mx: 0.3, my: 0.3 }}
          />
        </Box>

        <Footer />
      </Container>
    </>
  )
}

