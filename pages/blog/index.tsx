import { Box, Container, List} from '@mui/material';
import Footer from '../../components/footer';
import { MetaContentI } from '../../contentlayer.config';
import PostPreview, { PostPreviewI } from '../../components/post-prev';
import { allBlogs } from 'contentlayer/generated';
import { PostElement, POST_ATTRIBUTES } from 'pages';
import HeaderSm from 'components/header-sm';


export default function HomeApps() {
  
  let contentList: MetaContentI[] = [...allBlogs].map(e => {
    return {
      ...e,
      type: e.contentType,
      link: e.url,
      date: new Date(e.date)
    }
  }) as MetaContentI[];

  contentList.sort((a,b)=>b.date.getTime()-a.date.getTime());

  return (
    <>
      <Container maxWidth="sm">
        <HeaderSm />
        <h2>Posts</h2>
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

        <Footer />
      </Container>
    </>
  )
}

