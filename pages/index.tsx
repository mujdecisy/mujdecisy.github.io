import { Box, Chip, Container, Divider, List, Typography } from '@mui/material';
import Footer from '../components/footer';
import Header from '../components/header';
import { MetaContentI } from '../contentlayer.config';
import PostPreview, { PostPreviewI } from '../components/post-prev';
import { allBlogs, allProjects, allApps } from 'contentlayer/generated';
import { useEffect } from 'react';
import { logVisit } from '../utils/firebase';

export interface PostElement {
  navLabel: string
  navHref: string
  color: string
}

export const POST_ATTRIBUTES: Record<string, PostElement> = {
  project: {
    navLabel: 'Project',
    navHref: '/project',
    color: 'var(--t1)'
  },
  post: {
    navLabel: 'Blog',
    navHref: '/blog',
    color: 'var(--t2)'
  },
  app: {
    navLabel: 'App',
    navHref: '/app',
    color: 'var(--t3)'
  }
}

export default function Home() {
  const navItems: string[] = ['project', 'post', 'app'];

  useEffect(()=>{
    logVisit("/");
  }, []);
  
  let contentList: MetaContentI[] = [...allApps, ...allBlogs, ...allProjects].map(e => {
    return {
      ...e,
      type: e.contentType,
      link: e.url,
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
                  item={{ ...e, color: POST_ATTRIBUTES[e.type].color, date: e.date.toISOString().substring(2,10) } as PostPreviewI}
                  key={e.link}
                />
              )
            }
          </List>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1, mt: 3 }}>
          {
            navItems.map(e =>
              <Chip
                label={POST_ATTRIBUTES[e].navLabel}
                component="a"
                href={POST_ATTRIBUTES[e].navHref}
                size="small"
                clickable
                sx={{ mx: 0.3, my: 0.3, backgroundColor: POST_ATTRIBUTES[e].color + ' !important',
                  "&hover": {backgroundColor: POST_ATTRIBUTES[e].color + ' !important'}}}
                key={e}
              />
            )
          }
          <Chip
            label='All'
            component="a"
            href='/all'
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

