import { Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Head from 'next/head'
import { ContentI } from '../contentlayer.config';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Footer from './footer';
import HeaderSm from './header-sm';

export default function ContentLayout({ content }: { content: ContentI }) {
    const renderImg = (imageUrl: string, explanation: string) => (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={imageUrl} />
            <div className="img-exp">{explanation}</div>
        </div>
    );

    const renderCkp = (ckp: string) => (
        <span id={ckp}></span>
    );

    const renderTbl = (headers: string[], rows: string[][], explanation: string) => {
        return (
            <>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableCell align='center' key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row[0]}>
                    {row.map(cell => (
                      <TableCell align='center' key={cell}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="img-exp">{explanation}</div>
            </>
        );
      };

    const Component = useMDXComponent(content.body.code);
    return (
        <>
            <Head>
                <title>{content.title}</title>
            </Head>
            <Container maxWidth="sm">
                <HeaderSm/>
                <article className="mx-auto max-w-2xl py-16">
                    {/* <div className="cl-post-body" dangerouslySetInnerHTML={{ __html: content.body.html }} /> */}
                    <Component
                        rdrImg={renderImg}
                        rdrCkp={renderCkp}
                        rdrTbl={renderTbl}
                    />
                </article>
                <Footer/>
            </Container>
        </>
    );
}
