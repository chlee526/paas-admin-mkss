<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="util.*, risk.json.*" %>
<%

	ParseRequest pr = new ParseRequest(request);	

	session = request.getSession();
	JSONObject result = new JSONObject();
	JSONObject obj = new JSONObject();
	String userId = (String)session.getAttribute("SS_M_ID");

	LoginManager lm = LoginManager.getInstance();
	lm.removeSession(userId);
	
	obj.put("code", 200);
	obj.put("msg", "성공");
	result.put("result",obj);
	out.print(result);
	
%>