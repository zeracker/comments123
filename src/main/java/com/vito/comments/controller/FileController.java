//package com.hsnn.bankPay.controller;
//
//import com.hsnn.bankPay.entity.base.ResObj;
//import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;
//import org.json.JSONException;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.annotation.Scope;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import org.springframework.web.multipart.MultipartHttpServletRequest;
//import org.springframework.web.util.WebUtils;
//import com.hsnn.bankPay.controller.base.BaseController;
//import com.hsnn.bankPay.util.PdfUtil;
//
//import javax.imageio.ImageIO;
//import java.awt.image.BufferedImage;
//import java.io.*;
//import java.util.*;
//
//
//@RestController
//@Scope("prototype")
//public class FileController extends BaseController{
//
//	private static final Logger log = LoggerFactory.getLogger(FileController.class);
//
//	@Autowired
//	private ApplicationContext applicationContext;
//
//	//文件路径
//	@Value("${pros.filesavepath}")
//	private String filesavepath;
//
////	@Value("${path.upload.server}")
////	private String pathUploadServer;
//
//
//	@Autowired
//	private SysAttachmentService sysAttachmentService;
//
//	@Autowired
//	private BaseImgannexService baseImgannexService;
//
//	@Autowired
//	private TradeInvoiceimgService tradeInvoiceimgService;
//
//	@Autowired
//	private BankImgService bankImgService;
//
//
//	@Autowired
//	private BankImgDao bankImgDao;
//
//
//
//	@RequestMapping("/fileurl")
//	@ResponseBody
//	public Object fileinfo(String fileId) {
//		log.info("文件长度1：");
//		File file = new File("C:/Users/小猪佩奇/Desktop/测试/1234565432.jpg");
//		writeFile(file);
//		return null;
//	}
//	/**
//	 * 单个文件信息
//	 * @return
//	 */
//	@RequestMapping(value = "/upoadFile")
//	@ResponseBody
//	public Object upoadFile(@RequestParam("file")MultipartFile multipartFile,String  pdfType) throws IOException, JSONException {
//		//log.info("文件长度："+multipartFile.getSize()+"|"+multipartFile.getName()+"|"+multipartFile.getContentType()+"|"+multipartFile.getOriginalFilename());
//		System.out.println("文件类型："+pdfType);
//		log.info("文件类型log："+pdfType);
//		String fileName = multipartFile.getOriginalFilename();
//		String fileType = fileName.substring(fileName.indexOf("."),fileName.length());
//		String fileNameUid = ""+UUID.randomUUID();
//		SysUser user = (SysUser) session.getAttribute("userinfo");
//		Map<String,Object> resMap = new HashMap<String,Object>();
//		//获取文件内容
//		if(ServletFileUpload.isMultipartContent(request)) {
//			//创建ServletFileUpload实例
//			MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
////			voiceStr = "";
//			String filePath = filesavepath + File.separator + user.getUserName() + File.separator;
//			String cropPath = filePath;
//			log.info(filePath);
//			//保存文件
//			multipartRequest.getFileMap().forEach((filename,multifile) -> {
//				try {
//					File f = new File(filePath + fileNameUid+""+fileType );
//					if(!f.exists()) {
//						f.mkdirs();
//					}
//					//保存文件信息
//					multifile.transferTo(f);
//					//保存缩略图
//					PdfUtil.pdf2Pic(f.getAbsolutePath() , filePath +"thumbnail/"+ fileNameUid + ".png");
//
//					if(user == null){
//						user.setUserId("");
//					}
//					BaseImgannex imgannex = new BaseImgannex();
//					imgannex.setImgannexid(fileNameUid);
//					imgannex.setImgannexname(fileName);
//					imgannex.setNarrowimgurl("thumbnail/"+ user.getUserName() + File.separator + fileNameUid + ".png");
//					imgannex.setImgannexstatus("0");
//					imgannex.setImgannextype(pdfType);
//					imgannex.setAddtime(new Date());
//					imgannex.setAdduserid(user.getUserId());
//					imgannex.setImgannexurl(user.getUserName() + File.separator + fileNameUid + fileType );
//					resMap.put("fileId" , fileNameUid);
//					baseImgannexService.insert(imgannex);
//				} catch (IllegalStateException e) {
//					log.error(e.getMessage());
//					e.printStackTrace();
//				} catch (IOException e) {
//					e.printStackTrace();
//					log.error(e.getMessage());
//				}
////				catch (PDFException e) {
////					log.error(e.getMessage() ,e);
////					e.printStackTrace();
////				}catch (PDFSecurityException e) {
////					log.error(e.getMessage() ,e);
////					e.printStackTrace();
////				}
//			});
//		}
//
////		SysAttachment sysAttachment = new SysAttachment();
////		sysAttachment.setFileOrigName(fileName);
////		sysAttachment.setFileName(fileNameUid+fileType);
////		sysAttachment.setOpenDate(new Date());
////		sysAttachment.setOpenOperId(user.getUserId());
////		sysAttachment.setFileType(multipartFile.getContentType());
////		sysAttachment.setFileSize(""+(multipartFile.getSize()/1024));
////		sysAttachment.setFilePath(filesavepath);
////		int sysAttachmentId = sysAttachmentService.insert(sysAttachment);
////		JSONObject object = new JSONObject();
////		object.put("fileId",sysAttachment.getFileId());
//		ResObj res = ResObj.build("1" , "上传成功");
//		res.setData(resMap);
//		return res;
//	}
//
//
//
//	/**
//	 * 上传图片信息
//	 * @param multipartFile
//	 * @param
//	 * @return
//	 * @throws IOException
//	 * @throws JSONException
//	 */
//	@RequestMapping(value = "/upoadImgFile")
//	@ResponseBody
//	public Object upoadImgFile(@RequestParam("file")MultipartFile multipartFile,String invoiceid,String invoicecode) throws IOException, JSONException {
//		log.info("发票编号"+invoiceid+"|"+ invoicecode);
//		String fileName = multipartFile.getOriginalFilename();
//		String fileType = fileName.substring(fileName.indexOf("."),fileName.length());
//		String fileNameUid = ""+UUID.randomUUID();
//		SysUser user = (SysUser) session.getAttribute("userinfo");
//		Map<String,Object> resMap = new HashMap<String,Object>();
//		//获取文件内容
//		if(ServletFileUpload.isMultipartContent(request)) {
//			//创建ServletFileUpload实例
//			MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
////			voiceStr = "";
//			String filePath = filesavepath + File.separator + user.getUserName() + File.separator;
//			String cropPath = filePath;
//			log.info(filePath);
//			//保存文件
//			multipartRequest.getFileMap().forEach((filename,multifile) -> {
//				try {
//					File f = new File(filePath + fileNameUid+""+fileType );
//					if(!f.exists()) {
//						f.mkdirs();
//					}
//					//保存文件信息
//					multifile.transferTo(f);
//					//保存缩略图
////					PdfUtil.pdf2Pic(f.getAbsolutePath() , filePath +"thumbnail/"+ fileNameUid + ".png");
//
//					if(user == null){
//						user.setUserId("");
//					}
//
//					TradeInvoiceimg tradeInvoiceimg = new TradeInvoiceimg();
//					tradeInvoiceimg.setImgannexid(fileNameUid);
//					tradeInvoiceimg.setComid(user.getOrgId());
//					tradeInvoiceimg.setInvoiceid(invoiceid);
//					tradeInvoiceimg.setInvoicecode(invoicecode);
//					tradeInvoiceimg.setImgannexid(fileNameUid);
//					tradeInvoiceimg.setAdduserid(user.getUserId());
//					tradeInvoiceimg.setAddtime(new Date());
//					tradeInvoiceimg.setImgannexname(fileName);
//					tradeInvoiceimg.setImgannexurl(user.getUserName() + File.separator+fileNameUid + fileType );
//					tradeInvoiceimgService.insert(tradeInvoiceimg);
//					resMap.put("fileId" , fileNameUid);
//				} catch (IllegalStateException e) {
//					log.error(e.getMessage());
//					e.printStackTrace();
//				} catch (IOException e) {
//					e.printStackTrace();
//					log.error(e.getMessage());
//				}catch(Exception e) {
//					e.printStackTrace();
//					log.error(e.getMessage());
//				}
//			});
//		}
//		ResObj res = ResObj.build("1" , "上传成功");
//		res.setData(resMap);
//		return res;
//	}
//
//	@RequestMapping(value = "/upoadImgFilePay")
//	@ResponseBody
//	public Object upoadImgFilePay(@RequestParam("file")MultipartFile multipartFile,String types,String invoicecode) throws IOException, JSONException {
//		log.info("类型"+types);
//		String fileName = multipartFile.getOriginalFilename();
//		String fileType = fileName.substring(fileName.indexOf("."),fileName.length());
//		String fileNameUid = ""+UUID.randomUUID();
//		SysUser user = (SysUser) session.getAttribute("userinfo");
//		Map<String,Object> resMap = new HashMap<String,Object>();
//		//获取文件内容
//		if(ServletFileUpload.isMultipartContent(request)) {
//			//创建ServletFileUpload实例
//			MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
////			voiceStr = "";
//			String filePath = filesavepath + File.separator + user.getUserName() + File.separator;
//			String cropPath = filePath;
//			log.info(filePath);
//			//保存文件
//			multipartRequest.getFileMap().forEach((filename,multifile) -> {
//				try {
//					File f = new File(filePath + fileNameUid+""+fileType );
//					if(!f.exists()) {
//						f.mkdirs();
//					}
//					//保存文件信息
//					multifile.transferTo(f);
//					//保存缩略图
////					PdfUtil.pdf2Pic(f.getAbsolutePath() , filePath +"thumbnail/"+ fileNameUid + ".png");
//
//					if(user == null){
//						user.setUserId("");
//					}
//					BankImg bankimg = new BankImg();
//					bankimg.setBankimgid(fileNameUid);
//					bankimg.setComid(user.getOrgId());
//					bankimg.setAdduserid(user.getUserId());
//					bankimg.setAddtime(new Date());
//					bankimg.setImgannexname(fileName);
//					bankimg.setImgannexurl(user.getUserName() + File.separator+fileNameUid + fileType );
//					bankimg.setType(types);
//					log.info("图片："+bankimg);
//					Date date = new Date();
//					bankImgDao.insert(bankimg);
////					bankImgDao.insertImg(fileNameUid,user.getOrgId(),fileName,bankimg.getImgannexurl(),user.getUserId(),date,types);
//					resMap.put("fileId" , fileNameUid);
//				} catch (IllegalStateException e) {
//					log.error(e.getMessage());
//					e.printStackTrace();
//				} catch (IOException e) {
//					e.printStackTrace();
//					log.error(e.getMessage());
//				}catch(Exception e) {
//					System.out.println(e.getMessage());
//					e.printStackTrace();
//					log.error(e.getMessage());
//				}
//			});
//		}
//		ResObj res = ResObj.build("1" , "上传成功");
//		res.setData(resMap);
//		return res;
//	}
//
//
//
//	@RequestMapping(value = "/getImgFile")
//	@ResponseBody
//	public Object getImgFile(String fileId) throws IOException, JSONException {
//		TradeInvoiceimg tradeInvoiceimg = tradeInvoiceimgService.getById(fileId);
//		log.info("返回信息："+tradeInvoiceimg);
//		if(tradeInvoiceimg != null ){
//			File f = new File(filesavepath + File.separator + tradeInvoiceimg.getImgannexurl());
//			if(f.exists()){
//				response.setHeader("Access-Control-Allow-Headers" , "Content-Type, api_key, Authorization");
//				response.setHeader("Access-Control-Allow-Origin" , "*");
//				writeFile(f);
//			}
//		}
//
//		return null;
//	}
//	@RequestMapping(value = "/getBankImgFile")
//	@ResponseBody
//	public Object getBankImgFile(String fileId) throws IOException, JSONException {
//		BankImg bankImg = bankImgDao.getById(fileId);
//		log.info("返回信息："+bankImg);
//		if(bankImg != null ){
//			File f = new File(filesavepath + File.separator + bankImg.getImgannexurl());
//			if(f.exists()){
//				response.setHeader("Access-Control-Allow-Headers" , "Content-Type, api_key, Authorization");
//				response.setHeader("Access-Control-Allow-Origin" , "*");
//				writeFile(f);
//			}
//		}
//
//		return null;
//	}
//
//	@RequestMapping(value = "/getFile")
//	@ResponseBody
//	public Object upoadFile(String fileId) throws IOException, JSONException {
//
//		BaseImgannex imgannex = baseImgannexService.getById(fileId);
//		if(imgannex != null ){
//			File f = new File(filesavepath + File.separator + imgannex.getImgannexurl());
//			if(f.exists()){
//				response.setHeader("Access-Control-Allow-Headers" , "Content-Type, api_key, Authorization");
//				response.setHeader("Access-Control-Allow-Origin" , "*");
//				writeFile(f);
//			}
//
//		}
//
//		return null;
//	}
//
//	@RequestMapping(value = "/getThumbnail")
//	@ResponseBody
//	public Object getThumbnail(String fileId) throws IOException, JSONException {
//		BaseImgannex imgannex = baseImgannexService.getById(fileId);
//		if(imgannex != null ){
//			File f = new File(filesavepath + File.separator + imgannex.getNarrowimgurl());
//			if(f.exists()){
//				writeFile(f);
//			}
//
//		}
//
//		return null;
//	}
//
//	public static void main(String[] args) throws Exception {
//		//读取图片
//		byte[] content = null;
//		File file = new File("D:\\images\\35f5019d-97cc-4c6b-9ace-fcce1b996361.pdf");
//		FileInputStream in = new FileInputStream(file);
//
////		ByteArrayOutputStream bos = new ByteArrayOutputStream(1024);
////		byte[] b = new byte[1024];
////		int n;
////		while ((n = in.read(b)) != -1) {
////			bos.write(b, 0, n);
////		}
//
//		BufferedImage bImage = ImageIO.read(in);//将inputSteam读取成bufferdImage
//
//		int height = bImage.getHeight()/4;//获取转化后的高度
//		int width = bImage.getWidth()/4;//获取转化后的宽度
//
//		//声明一个新的BufferdImage
//		BufferedImage newBImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
//		//设置newBImage的参数
//		newBImage.getGraphics().drawImage(bImage, 0, 0, width, height, null);
//		ByteArrayOutputStream out = new ByteArrayOutputStream();
//		ImageIO.write(newBImage, "jpg", out);
//		in.close();
//	}
//}
