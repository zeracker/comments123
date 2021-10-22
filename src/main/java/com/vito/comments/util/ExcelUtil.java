package com.vito.comments.util;

import com.vito.comments.entity.base.ResObj;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * excel 工具类
 */
public class ExcelUtil {


    public static  void exportData(ResObj res, HttpServletResponse response) throws Exception {
//        res.put("count", count);
//        res.put("data", dataList);
//        res.put("header", headerList);
        if(AssertUtil.notNull(res) && "1".equals(res.getState())){
            XSSFWorkbook workbook = new XSSFWorkbook();
            Map<String , Object> data = (Map<String, Object>) res.getData();
            List<Map<String,Object>> dataList = (List<Map<String, Object>>) data.get("data");
            List<Map<String,Object>> headerList = (List<Map<String, Object>>) data.get("header");

            List<String> headerNames = new ArrayList<>();
            List<String> attrNames = new ArrayList<>();
            for (Map<String, Object> stringObjectMap : headerList) {
                if((String) stringObjectMap.get("hide") == null){
                    headerNames.add((String) stringObjectMap.get("title"));
                    attrNames.add((String) stringObjectMap.get("field"));
                }
            }

            String []columnNames = headerNames.toArray(new String[headerNames.size()]);

            XSSFSheet sheet = workbook.createSheet();
            Font titleFont = workbook.createFont();
            titleFont.setFontName("simsun");
            titleFont.setBold(true);
            titleFont.setColor(IndexedColors.BLACK.index);

            Row titleRow = sheet.createRow(0);

            for (int i = 0; i < columnNames.length; i++) {
                Cell cell = titleRow.createCell(i);
                cell.setCellValue(columnNames[i]);
//            cell.setCellStyle(titleStyle);
            }
            //创建数据行并写入值
            for (int j = 0; j < dataList.size(); j ++) {
                int lastRowNum = sheet.getLastRowNum();
                Row dataRow = sheet.createRow(lastRowNum + 1);
                for(int k = 0; k < attrNames.size();k++){
                    Map<String,Object> rowMap = dataList.get(j);
                    dataRow.createCell(k).setCellValue((String) rowMap.get(attrNames.get(k)));
                }
            }
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("content-Disposition", "attachment;filename=" + URLEncoder.encode("导出数据.xls", "utf-8"));
            response.setHeader("Access-Control-Expose-Headers", "content-Disposition");
            OutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            outputStream.flush();
            outputStream.close();
        }

    }


    public static void main(String[] args) {

    }
}
