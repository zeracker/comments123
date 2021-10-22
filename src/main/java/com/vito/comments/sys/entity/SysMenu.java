package com.vito.comments.sys.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonFormat;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;


/**
* Created by hbm Generator<27683139@qq.com> on 2021-10-22.
*/
@Table(name = "sys_menu")
public class SysMenu implements Serializable {
        /**
         *菜单id
         */
         @Id
   		 @GeneratedValue(generator = "UUID")
   		 @Column(name="menu_id")
         private String menuId; 
         
        /**
         *上级菜单
         */
         @Column(name="parent_id")
         private String parentId;
         
        /**
         *菜单名
         */
         @Column(name="menu_name")
         private String menuName;
         
        /**
         *菜单icon
         */
         @Column(name="menu_icon")
         private String menuIcon;
         
        /**
         *菜单级别,#为父菜单
         */
         @Column(name="menu_level")
         private String menuLevel;
         
        /**
         *访问路径
         */
         @Column(name="menu_path")
         private String menuPath;
         
        /**
         *排序
         */
         @Column(name="sort_flag")
         private BigDecimal sortFlag;
         
        /**
         *创建时间
         */
   		 @JsonFormat(pattern = "yyyy-MM-dd")
         @Column(name="ctr_time")
         private Date ctrTime;
         
        /**
         *创建人id
         */
         @Column(name="ctr_id")
         private String ctrId;
         
        /**
         *最后修改时间
         */
   		 @JsonFormat(pattern = "yyyy-MM-dd")
         @Column(name="upd_time")
         private Date updTime;
         
        /**
         *最后修改人id
         */
         @Column(name="upd_id")
         private String updId;
         

        public String getMenuId() {
            return menuId;
        }

        public void setMenuId(String menuId) {
            this.menuId = menuId;
        }
        public String getParentId() {
            return parentId;
        }

        public void setParentId(String parentId) {
            this.parentId = parentId;
        }
        public String getMenuName() {
            return menuName;
        }

        public void setMenuName(String menuName) {
            this.menuName = menuName;
        }
        public String getMenuIcon() {
            return menuIcon;
        }

        public void setMenuIcon(String menuIcon) {
            this.menuIcon = menuIcon;
        }
        public String getMenuLevel() {
            return menuLevel;
        }

        public void setMenuLevel(String menuLevel) {
            this.menuLevel = menuLevel;
        }
        public String getMenuPath() {
            return menuPath;
        }

        public void setMenuPath(String menuPath) {
            this.menuPath = menuPath;
        }
        public BigDecimal getSortFlag() {
            return sortFlag;
        }

        public void setSortFlag(BigDecimal sortFlag) {
            this.sortFlag = sortFlag;
        }
        public Date getCtrTime() {
            return ctrTime;
        }

        public void setCtrTime(Date ctrTime) {
            this.ctrTime = ctrTime;
        }
        public String getCtrId() {
            return ctrId;
        }

        public void setCtrId(String ctrId) {
            this.ctrId = ctrId;
        }
        public Date getUpdTime() {
            return updTime;
        }

        public void setUpdTime(Date updTime) {
            this.updTime = updTime;
        }
        public String getUpdId() {
            return updId;
        }

        public void setUpdId(String updId) {
            this.updId = updId;
        }
}
