import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export interface MetaContentI {
  date: Date
  title: string
  summary: string
  url: string
}

export interface ContentI extends MetaContentI {
  body: {
    html: string,
    code: any
  },
}

function getDocType(docTypeName: string) {
  return defineDocumentType(() => ({
    name: docTypeName,
    filePathPattern: `**/*.mdx`,
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
      summary: {
        type: 'string',
        required: true
      }
    },
    computedFields: {
      url: {
        type: 'string',
        resolve: content => `/posts/${content._raw.flattenedPath}`
      }
    }
  }))
}

export const Post = getDocType('Post');

export default makeSource({
  contentDirPath: 'contentlayer_data',
  documentTypes: [Post]
})
