/**
 * Copyright 2014-2015 Jiangsu SYAN tech. ltd.
 * Created by Iceberg on 2015/4/16.
 */

var Singleton = new function Singleton() {
    var instance = this;
    var netonex;
    var certx;
    var colx;
    Singleton.getInstance = function () {

        return instance;
    }

    this.toString = function () {
        return "[object  NetOneX Singleton]";
    }

    this.getNetOneX = function () {
        if (!netonex) {
            netonex = new NetONEX();
            netonex.setupObject();
        }

        return netonex;
    }

    this.setCertificateX = function (_certx) {
        certx = _certx;
    }

    this.getCertificateX = function () {
        return certx;
    }

    this.setCertificateCollectionX = function (_colx) {
        colx = _colx;
    }

    this.getCertificateCollectionX = function () {
        return colx;
    }

    return Singleton;
};