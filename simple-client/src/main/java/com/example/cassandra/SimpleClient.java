package com.example.cassandra;
import java.io.BufferedReader;
import java.io.FileReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.datastax.driver.core.BoundStatement;
import com.datastax.driver.core.Cluster;
import com.datastax.driver.core.PreparedStatement;
import com.datastax.driver.core.Session;
import com.datastax.driver.core.Host;
import com.datastax.driver.core.Metadata;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class SimpleClient {
	private Cluster cluster;
	private Session session;
	private JSONParser parser;
	
	public void connect(String node) {
		cluster = Cluster.builder().addContactPoint(node).build();
		Metadata metadata = cluster.getMetadata();
		System.out.printf("Connected to cluster %s\n", metadata.getClusterName());
	}
	
	public void close() {
		cluster.close();
	}
	
	public void loaddata() {
		session = cluster.connect();
		PreparedStatement statement = session.prepare(
				"insert into apmdb.apmevents " +
				"(eventdate, ffunction, sfduration, duration, name, machine, action, " +
			    " aspect, xclass, xmessage, description, eventtype) " +
				" values (?,?,?,?,?,?,?,?,?,?,?,?)");
		parser = new JSONParser();
		try {
			BufferedReader br = new BufferedReader(new FileReader("c:\\temp\\apm\\apm6.txt"));
			String line;
			while ((line = br.readLine()) != null ) {
				JSONObject jsonObj = (JSONObject)parser.parse(line);

				//2013-12-31T20:17:25.9410000
				Date eventdate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS").parse((String)jsonObj.get("eventdate"));
				String slowestfunction = (String) jsonObj.get("slowestfunction");
				String failedfunction = (String) jsonObj.get("failedfunction");
				String ffunction = failedfunction == null?  slowestfunction : failedfunction;
				Long sfduration = (Long) jsonObj.get("sfduration");
				Long duration = (Long)jsonObj.get("duration");
				String name = (String) jsonObj.get("name");
				String machine = (String) jsonObj.get("machine");
				String action = (String) jsonObj.get("action");
				Long aspect = (Long)jsonObj.get("aspect");
				String xclass = (String) jsonObj.get("xclass");
				String xmessage = (String) jsonObj.get("xmessage");
				String description = (String) jsonObj.get("description");
				Long eventtype = (Long)jsonObj.get("eventtype");

				BoundStatement bs = new BoundStatement(statement);
				bs.setDate("eventdate", eventdate);
				if (ffunction!=null) bs.setString("ffunction", ffunction);
				if (sfduration!=null) bs.setInt("sfduration", (int)(long) sfduration);
				if (duration!=null) bs.setInt("duration", (int)(long) duration);
				if (name!=null) bs.setString("name", name);
				if (machine!=null) bs.setString("machine", machine);
				if (action!=null) bs.setString("action", action);
				if (aspect!=null) bs.setInt("aspect", (int)(long) aspect);
				if (xclass!=null) bs.setString("xclass", xclass);
				if (xmessage!=null) bs.setString("xmessage", xmessage);
				if (description!=null) bs.setString("description", description);
				if (eventtype!=null) bs.setInt("eventtype", (int)(long) eventtype);

				session.execute(bs);
			} 
			br.close();
		}catch (Exception e)
		{
			System.out.printf(e.getMessage());
		}
	}
	
	public static void main(String[] args) {
		SimpleClient client = new SimpleClient();
		client.connect("peiwavm1.cloudapp.net");
		client.loaddata();
		client.close();
	}
}
