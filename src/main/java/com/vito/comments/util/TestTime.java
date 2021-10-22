package com.vito.comments.util;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.omg.CORBA.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import sun.net.www.protocol.http.HttpURLConnection;

import java.io.*;
import java.net.URL;

public class TestTime {
    @Autowired
    private Environment env;
    private static String account = "85151421178";
    public static void main(String[] args) throws IOException {
//        Date billDate = MyTimeUtil.getDateBefore(-1355);
//        System.out.println((MyTimeUtil.DateToStr(MyTimeUtil.yyyy_MM_dd,billDate)));
//        Long num = MyTimeUtil.getDaysOfTowDiffDate("2021-01-05","2024-12-20");
//        System.out.println("天数差："+num);
//        System.out.println(MyTimeUtil.strToDate(MyTimeUtil.yyyyMMddHHmmss,"20240921110219"));

//        System.out.println((BigDecimal.valueOf((int)(2+2))));
//        System.out.println(StringUtil.isMobile("15348673469"));
//        System.out.println(UUID.randomUUID());
//        File file = new File("C:/Users/小猪佩奇/Desktop/测试/1234565432.jpg");
//        FileItem fileItem = getMultipartFile(file,"templFileItem");
//        MultipartFile multipartFile = new CommonsMultipartFile(fileItem);
//        System.out.println(multipartFile.getOriginalFilename());
//        Date billDate = MyTimeUtil.getDateBefore(1);
//        System.out.println( MyTimeUtil.DateToStr(MyTimeUtil.yyyy_MM_dd, billDate));
//        System.out.println(env.getProperty("test.msg"));

//        BigDecimal a = new BigDecimal (102);
//        BigDecimal b = new BigDecimal (101);
//        System.out.println("结果："+a.compareTo(b));
//        if(a.compareTo(b) < 1){
//            System.out.println("a大于等于b");
//        }
//        String str ="1611463997405.pdf";
//        String[] filename = str.split("\\.");
//        System.out.println("正经人："+filename[0]);
//        MultipartFile attach = BASE64DecodedMultipartFile.base64ToMultipart("data:application/pdf;base64,JVBERi0xLjcNCjQgMCBvYmoNCjw8L1R5cGUgL1BhZ2UvUGFyZW50IDMgMCBSL0NvbnRlbnRzIDUgMCBSL01lZGlhQm94IFswIDAgNTkyLjUgODM5LjE1MDAyNDQxXS9SZXNvdXJjZXM8PC9Gb250PDwvRkFBQUFIIDcgMCBSL0ZBQUFCQiAxMSAwIFIvRkFBQUJGIDE1IDAgUi9GQUFBQ0IgMjEgMCBSL0ZBQUFDRCAyMyAwIFIvRkFBQUNIIDI3IDAgUi9GQUFBQ0ogMjkgMCBSL0ZBQUFEQyAzMiAwIFI+Pi9FeHRHU3RhdGU8PC9HUzEgMTMgMCBSL0dTMiAxOSAwIFIvR1MzIDM0IDAgUj4+Pj4vR3JvdXAgPDwvVHlwZS9Hcm91cC9TL1RyYW5zcGFyZW5jeS9DUy9EZXZpY2VSR0I+Pi9TdHJ1Y3RQYXJlbnRzIDAvVGFicyAvUz4+DQplbmRvYmoNCjUgMCBvYmoNCjw8L0xlbmd0aCAzNSAwIFI+PnN0cmVhbQ0KMSAwIDAgLTEgMCA4MzkuMTUwMDI0NDEgY20gcSAxIDAgMCAxIDkwIDcyIGNtIC9QIDw8L0xhbmcgKHpoLUNOKSAvTUNJRCAwID4+IEJEQyBCVCAvRkFBQUFIIDI2IFRmIDEgMCAwIC0xIDEyOC4yNSAzOS4wNjQ5OTg2MyBUbSAwIGcgWzwwMDAzMDAwNDAwMDUwMDA2MDAwNzAwMDg+XSBUSiBFVCBFTUMgL1AgPDwvTUNJRCAxID4+IEJEQyBCVCAvRkFBQUJCIDI2IFRmIDEgMCAwIC0xIDI4NC4yNSAzOS4wNjQ5OTg2MyBUbSAvR1MxIGdzIDAgZyBbKCApXSBUSiBFVCBFTUMgcSAxIDAgMCAxIDAgMTE4LjMxNDAwMjk5IGNtIC9QIDw8L0xhbmcgKHpoLUNOKSAvTUNJRCAyID4+IEJEQyBCVCAvRkFBQUJGIDE0IFRmIDEgMCAwIC0xIDAgMTQuMjE4MDAwNDEgVG0g");
//        System.out.println(attach.getOriginalFilename());
//        System.out.println("Name:"+attach.getName());
//        System.out.println("ContentType:"+attach.getContentType());
//        System.out.println("OriginalFilename:"+attach.getOriginalFilename());
//        System.out.println("Size:"+attach.getSize());
//        System.out.println("Bytes:"+attach.getBytes());
//        System.out.println("Class:"+attach.getClass());
//        System.out.println("InputStream:"+attach.getInputStream());
//        System.out.println(attach.getOriginalFilename());
//        File file  = transferToFile(attach);
//        System.out.println("姓名了："+file.getPath());
//        CommonsMultipartFile cf = (CommonsMultipartFile) attach;
//        System.out.println("234".split(",")[0]);

          System.out.println(DigestUtils.md5Hex("1"));
    }

    private static File transferToFile(MultipartFile multipartFile) {
//        选择用缓冲区来实现这个转换即使用java 创建的临时文件 使用 MultipartFile.transferto()方法 。
        File file = null;
        try {
            String originalFilename = multipartFile.getOriginalFilename();

            String[] filename = originalFilename.split("\\.");
            System.out.println("正经人："+filename[0]);
            file=File.createTempFile(filename[0], "."+filename[1]);
            multipartFile.transferTo(file);
            file.deleteOnExit();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return file;
    }
    private static FileItem getMultipartFile(File file, String fieldName){
        FileItemFactory factory = new DiskFileItemFactory(16, null);
        FileItem item = factory.createItem(fieldName, "text/plain", true, file.getName());
        int bytesRead = 0;
        byte[] buffer = new byte[8192];
        try {
            FileInputStream fis = new FileInputStream(file);
            OutputStream os = item.getOutputStream();
            while ((bytesRead = fis.read(buffer, 0, 8192)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.close();
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return item;
    }


    /** post??? ????url?? */
    /**
     * @param commString ????????url??????
     * @param address ????????url???
     * @return rec_string ???????????????
     * @catch Exception
     */
    public static String postURL(String commString, String address) {
        String rec_string = "";
        URL url = null;
        HttpURLConnection urlConn = null;
        try {
            /* ???url?????URL?? */
            url = new URL(address);
            /* ????????????url???? */
            urlConn = (HttpURLConnection) url.openConnection();
            /* ????????????? */
            urlConn.setConnectTimeout(30000);
            /* ??????????????? */
            urlConn.setReadTimeout(30000);
            /* ????post?????? */
            urlConn.setRequestMethod("POST");
            /* ????commString */
            urlConn.setDoOutput(true);
            OutputStream out = urlConn.getOutputStream();
            out.write(commString.getBytes("utf-8"));
            //out.write(commString.getBytes("GBK"), "utf-8");
            out.flush();
            out.close();
            /* ??????? ????????????????????? */
            BufferedReader rd = new BufferedReader(new InputStreamReader(urlConn.getInputStream(), "UTF-8"));
            StringBuffer sb = new StringBuffer();
            int ch;
            while ((ch = rd.read()) > -1) {
                sb.append((char) ch);
            }
            rec_string = sb.toString().trim();
            /* ??????????????? */
            rd.close();
        } catch (Exception e) {
            /* ?????? */
            rec_string = "-107";
            System.out.println(e);
        } finally {
            /* ???URL???? */
            if (urlConn != null) {
                urlConn.disconnect();
            }
        }
        /* ??????????? */
        return rec_string;
    }
}