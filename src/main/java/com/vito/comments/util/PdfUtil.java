package com.vito.comments.util;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
//import org.icepdf.core.exceptions.PDFException;
//import org.icepdf.core.exceptions.PDFSecurityException;
//import org.icepdf.core.pobjects.Document;
//import org.icepdf.core.pobjects.Page;
//import org.icepdf.core.util.GraphicsRenderingHints;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * PDF处理类
 */
public class PdfUtil {
    /**
     * 将pdf转换成图片
     */
    public static void pdf2Pic(String pdf , String pic) throws IOException{
//        Document doc = new Document();
//        doc.setFile(pdf);
//        BufferedImage image =
//                (BufferedImage) doc.getPageImage(0 , GraphicsRenderingHints.SCREEN,
//                        Page.BOUNDARY_CROPBOX,0F,0.2f);
//        RenderedImage renderedImage = image;
//        File f = new File(pic);
//        if(!f.exists()){
//            f.mkdirs();
//        }

        // 打开来源 pdf
        PDDocument pdfDocument = PDDocument.load(new File(pdf));
        PDFRenderer pdfRenderer = new PDFRenderer(pdfDocument);
        // 提取的页码
        int pageNumber = 0;
        // 以300 dpi 读取存入 BufferedImage 对象
        int dpi = 50;
        BufferedImage buffImage = pdfRenderer.renderImageWithDPI(pageNumber, dpi, ImageType.RGB);
        File f = new File(pic);
        if(!f.exists()){
            f.mkdirs();
        }
        ImageIO.write(buffImage , "jpg" , f);
        // 关闭文档
        pdfDocument.close();
    }

    public static void main(String[] args) throws IOException {
        pdf2Pic("D:\\Download\\1992muLu.pdf","D:\\thumbnails\\123.jpg");
    }
}
