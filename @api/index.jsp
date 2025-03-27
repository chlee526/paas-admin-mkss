<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dfw.view.user_work.UserWorkMgr"%>
<%@ page import = "java.util.*" %>
<%@ page import="util.ParseRequest
                 ,util.DateUtil                 
                 ,risk.json.*
                 "
%>
<%
ParseRequest pr = new ParseRequest(request);
pr.printParams();
DateUtil du = new DateUtil();
String today = du.getCurrentDate("yyyy-MM-dd");
UserWorkMgr Mgr = new UserWorkMgr();
JSONObject obj = new JSONObject();
JSONArray jarry = new JSONArray(); 
int limit = 100;
int nowpage = pr.getInt("nowpage",1);

String sh_option = pr.getString("sh_option", "");
String sh_value = pr.getString("sh_value", "");
String eDate = today;
String sDate = du.addDay_v2(today, -1);
String orderColumn = pr.getString("orderColumn", "cast(AA.won as unsigned) DESC");
String cmd = pr.getString("cmd","");


if( "list".equals(cmd)) {
	
	
}

%>