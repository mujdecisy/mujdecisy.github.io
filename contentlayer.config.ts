import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export interface MetaContentI {
  date: Date
  title: string
  type: string
  link: string
  summary: string
}

export interface ContentI extends MetaContentI {
  body: {
    html: string,
    code: any
  },
}

function getDocType(docTypeName: string, folder: string) {
  return defineDocumentType(() => ({
    name: docTypeName,
    filePathPattern: `**/${folder}/*.mdx`,
    contentType: 'mdx',
    fields: {
      title: {
        type: 'string',
        required: true
      },
      date: {
        type: 'string',
        required: true
      },
      contentType: {
        type: 'string',
        required: true
      },
      summary: {
        type: 'string',
        required: true
      }
    },
    computedFields: {
      url: {
        type: 'string',
        resolve: content => `/${content._raw.flattenedPath}`
      }
    }
  }))
}

export const Blog = getDocType('Blog', 'blog');
export const App = getDocType('App', 'app');
export const Project = getDocType('Project', 'project');

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, App, Project]
})
