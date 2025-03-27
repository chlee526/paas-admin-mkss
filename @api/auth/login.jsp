<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*
			,java.net.*
			,risk.admin.member.MemberDao
			,risk.admin.member.MemberBean
			,util.*
			,risk.admin.log.LogMgr
			,risk.admin.log.LogBean
			,risk.admin.log.LogConstants
			,risk.json.*"%>
<%
	ParseRequest pr = new ParseRequest(request);
	JSONObject param = pr.getObject(); 
	System.out.println( param.toString() );
	//pr.printParams();
	LoginManager lm = LoginManager.getInstance();
	LogMgr logMgr = new LogMgr();
	LogBean logBean = new LogBean();
	
	
	String FimUserID = param.getString("id") ;
	String FimUserPasswd = param.getString("pw");
	String ignrPusr = param.getString("ignrPusr") ;
	
	ConfigUtil cu = new ConfigUtil();
	MemberDao mdao = new MemberDao();
	MemberBean member = null;
	JSONObject result = new JSONObject();
	JSONObject obj = new JSONObject();
	
	boolean idCheck = mdao.checkUser( FimUserID , FimUserPasswd);
	
	if(idCheck){
		
		if("true".equals(ignrPusr)){
			
			lm.removeSession( FimUserID );
			
		}
		
		//사용자 조회 및  패스워드 확인
		member = (MemberBean) mdao.schID(FimUserID, FimUserPasswd);
			
		if(member != null){
			session = request.getSession();			
			session.setAttribute("SS_M_NO", member.getM_seq());
			session.setAttribute("SS_L_NO", member.getL_seq());
			session.setAttribute("SS_M_ID", member.getM_id());
			session.setAttribute("SS_M_NAME", member.getM_name());
			session.setAttribute("SS_MG_NO", member.getMg_seq());
			session.setAttribute("SS_M_DEPT", member.getM_dept());
			session.setAttribute("SS_M_IP", request.getRemoteAddr());
			session.setAttribute("SS_M_MAIL", member.getM_mail());
			session.setAttribute("SS_M_HP", member.getM_hp());
			session.setAttribute("SS_TITLE", cu.getConfig("TITLE"));
			session.setAttribute("SS_URL", cu.getConfig("URL"));
			session.setAttribute("SS_SEARCHDATE", "");
			session.setMaxInactiveInterval(24*60*60);	
			lm.setSession(session, member.getM_id());
			lm.printloginUsers();
			
			//사용자 기본 환경을 조회하여 세션에 저장한다.
			String user_no = (String)member.getM_seq();
			String auth = (String)member.getMg_seq();	
			String name = (String)member.getM_name();
			
			logBean = new LogBean();
			logBean.setKey("0");
			logBean.setL_kinds(LogConstants.loginKindsVal);
			logBean.setL_type(LogConstants.insertTypeVal);
			logBean.setL_ip(request.getRemoteAddr());
			logBean.setM_seq(user_no);
			
			obj.put("name", name);
			obj.put("auth", Integer.parseInt(auth));
			obj.put("user_no", Integer.parseInt(user_no));
		}else{
			obj.put("error_code", -2);
			obj.put("msg", "실패");
		}
		
	}else{
		obj.put("error_code", -2);
		obj.put("msg", "실패");
		
	}
	
		
	result.put("result", obj);
	out.print(obj);

%>