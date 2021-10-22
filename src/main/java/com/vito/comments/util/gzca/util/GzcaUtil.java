package com.vito.comments.util.gzca.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class GzcaUtil {
    private static final Log log = LogFactory.getLog(GzcaUtil.class);
    private static DateFormat dateFormat;

    public GzcaUtil() {
    }

    public static String byte2HexString(byte[] bytes) {
        StringBuffer buf = new StringBuffer(bytes.length * 2);

        for(int i = 0; i < bytes.length; ++i) {
            if ((bytes[i] & 255) < 16) {
                buf.append("0");
            }

            buf.append(Long.toString((long)(bytes[i] & 255), 16));
        }

        return buf.toString().toUpperCase();
    }

    public static String string2HexString(String data) {
        return byte2HexString(data.getBytes());
    }

    public static String hexString2String(String hex_string) {
        StringBuffer char_string = new StringBuffer("");

        while(hex_string != null && hex_string.length() >= 2) {
            try {
                char_string.append((char)Byte.parseByte(hex_string.substring(0, 2), 16));
                hex_string = hex_string.substring(2);
            } catch (NumberFormatException var3) {
                log.error("HexString2StringError.NumberFormatException-L2", var3);
            }
        }

        return new String(char_string);
    }

    public static String md5Encode(String data) {
        MessageDigest messageDigest = null;

        try {
            messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.reset();
            messageDigest.update(data.getBytes());
        } catch (NoSuchAlgorithmException var5) {
            log.error("md5EncodeString.NoSuchAlgorithmException-L2", var5);
        }

        byte[] byteArray = messageDigest.digest();
        StringBuffer md5StrBuff = new StringBuffer();

        for(int i = 0; i < byteArray.length; ++i) {
            if (Integer.toHexString(255 & byteArray[i]).length() == 1) {
                md5StrBuff.append("0").append(Integer.toHexString(255 & byteArray[i]));
            } else {
                md5StrBuff.append(Integer.toHexString(255 & byteArray[i]));
            }
        }

        return md5StrBuff.toString();
    }

    public static String sha1Encode(String data) {
        String resultString = null;
        resultString = new String(data);

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            resultString = byte2HexString(md.digest(resultString.getBytes()));
        } catch (NoSuchAlgorithmException var4) {
            log.error("sha1EncodeString.NoSuchAlgorithmException-L2", var4);
        }

        return resultString;
    }

    public static String base64Encode(byte[] data) {
        return new String(Base64.encodeBase64(data));
    }

    public static String base64Decode(String base64String) {
        return new String(Base64.decodeBase64(base64String));
    }

    public static String dateFormat(Date date, String format) {
        if (!format.isEmpty() && format != null) {
            dateFormat = new SimpleDateFormat(format);
            return dateFormat.format(date);
        } else {
            format = "yyyy-MM-dd hh:mm:ss";
            return null;
        }
    }

    public static String base64Encode(String data){
        byte[] databyte = new byte[0];
        try {
            databyte = data.getBytes("utf-8");
            return new String(Base64.encodeBase64(databyte));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }
}