'use strict';

import {saveAs} from 'file-saver';

/**
 * Handles Read error event.
 *
 * For now just alert...
 *
 * @param {Object} error Error event from FileReader.
 *
 * @return {void}
 */
export function handle_read_error(error) {
    switch (error.target.error.code) {
        case error.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case error.target.error.NOT_READABLE_ERR:
            alert('Cannot read file');
            break;
        case error.target.error.ABORT_ERR:
            break; // noop
        default:
            error('An error occurred reading this file.');
    }
}

/**
 * Read text file from disk.
 *
 * @param {File} file File instance.
 * @param {Function} callback Function that accepts error event as first argument. The second argument is result.
 *
 * @return {void}
 */
export function read_text_file(file, callback) {
    const reader = new FileReader();

    reader.onerror = (event) => {
        callback(event, null);
    };
    reader.onloadend = () => {
        callback(null, reader.result, file.name);
    };

    reader.readAsText(file);
}

/**
 * Save text file to disk.
 *
 * @param {String} file_name Name of file to save.
 * @param {String} content String with content of file
 * @param {String} type MIME type of file. Optional.
 *
 * @return {void}
 */
export function save_text_file(file_name, content, type='') {
    var blob = new Blob([content], {type: type});
    saveAs(blob, file_name);
}

/**
 * Save Blob as file to disk.
 *
 * @param {String} file_name Name of file to save.
 * @param {Blob} content Content of file.
 *
 * @return {void}
 */
export function save_blob(file_name, content) {
    saveAs(content, file_name);
}

export default {
    read_text_file: read_text_file,
    handle_read_error: handle_read_error,
    save_text_file: save_text_file,
    save_blob: save_blob
};
