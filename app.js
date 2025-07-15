const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/process', upload.fields([{ name: 'video' }, { name: 'captions' }]), (req, res) => {
    const videoPath = req.files['video'][0].path;
    const captionsPath = req.files['captions'][0].path;
    const outputPath = `output/${Date.now()}_output.mp4`;

    const path = require('path');

const videoAbsolutePath = path.resolve(videoPath);
const captionsAbsolutePath = path.resolve(captionsPath);
const outputAbsolutePath = path.resolve(outputPath);

const ffmpegCmd = `ffmpeg -i "${videoAbsolutePath}" -vf subtitles="${captionsAbsolutePath}" "${outputAbsolutePath}"`;


    exec(ffmpegCmd, (error) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error processing video');
        }

        res.download(outputPath, () => {
            fs.unlinkSync(videoPath);
            fs.unlinkSync(captionsPath);
            fs.unlinkSync(outputPath);
        });
    });
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
