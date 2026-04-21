import React, { useState } from 'react';
import { Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
);

const LightFileupload = ({ onUpload, uploading = false }) => {
  const [files, setFiles] = useState([]);

  const handleProcess = async () => {
    const selectedFile = files?.[0]?.file;
    if (!selectedFile || !onUpload) return;

    await onUpload(selectedFile);
    setFiles([]);
  };

  return (
    <>
      <Card>
        <CardBody>
          <Row className='file-uploader-box'>
              <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={false}
                name='files'
                className={'filelight filepondlight1 file-light-primary w-100'}
                data-allow-reorder='true'
                labelIdle={`<i className="fa-solid fa-cloud-upload fa-fw f-s-25"></i> <div className="filepond--label-action text-decoration-none">Upload Your Files</div>`}
              />
              <Button
                color='primary'
                className='w-100'
                onClick={handleProcess}
                disabled={uploading || !files.length}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default LightFileupload;
