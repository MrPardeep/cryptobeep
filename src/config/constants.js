"use strict";

const BASE_URL = 'http://192.168.4.253:3013/';

const STATUS_CODES = {
    ERROR: 400,
    SUCCESS: 200,
    SERVER_ERROR: 500,
    UNAUTHORIZED: 401
};

//========================== Export Module Start ===========================

module.exports = {
    STATUS_CODES,
    BASE_URL
};

//========================== Export Module END ===========================
