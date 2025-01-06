import { PlusOutlined } from '@ant-design/icons'
import { Typography, Upload } from 'antd'
import React, { useRef } from 'react'
import { processImage, validateImageFile } from '../../../helper/upload-image'

const CustomUploadBase64 = props => {
  const { value = [], onChange = () => {}, maxCount = 0, ...restProps } = props
  const lblInfoRef = useRef()

  const onChangeOriginal = info => {
    const { file } = info

    if (file.status === 'removed') {
      onChange(value.filter(e => e !== file.url))
      lblInfoRef.current.innerText = ''
      return
    }

    // Check file extension (allow only images)
    if (!validateImageFile(file)) {
      return
    }

    // compress image
    processImage(
      file,
      resizedImageBase64 => {
        if (props.maxCount > 1) onChange([...value, resizedImageBase64])
        else onChange([resizedImageBase64])
      },
      lblInfoRef,
    )
  }
  return (
    <>
      <Upload
        {...restProps}
        maxCount={maxCount}
        fileList={value.map(e => ({ url: e }))}
        onChange={onChangeOriginal}
      >
        {value.length >= maxCount ? null : uploadButton}
      </Upload>
      <Typography.Text ref={lblInfoRef} />
    </>
  )
}

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Choose Image
    </div>
  </div>
)

export default CustomUploadBase64
