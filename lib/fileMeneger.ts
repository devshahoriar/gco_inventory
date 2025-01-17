/* eslint-disable @typescript-eslint/no-explicit-any */
import Imagekit from 'imagekit'

export const imageKit = new Imagekit({
  publicKey: 'public_S8fjs9kslVGIlAIZ8pQ2fBqSeNg=',
  privateKey: 'private_Zj4yuGBmuSp6sAZKVvFLiZdrk9c=',
  urlEndpoint: 'https://ik.imagekit.io/proshuvo',
})

// un testedexpo
export const UploadFile = async (
  file: File | any,
  fileName: string,
  folder: string = ''
): Promise<{ fileId: string; url: string }> => {
  const byte = await file.arrayBuffer()
  const buffer = Buffer.from(byte)

  return new Promise((resolve, reject) => {
    imageKit.upload(
      {
        file: buffer,
        fileName: fileName,
        folder: 'gco_inventory/' + folder,
      },
      (err: any, result: any) => {
        if (err) {
          reject(err)
        } else {
          const { fileId, url } = result as any
          resolve({ fileId, url })
        }
      }
    )
  })
}

export const FileDelete = async (fileId: string) => {
  return new Promise((resolve, reject) => {
    imageKit.deleteFile(fileId, (err: any, result: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
