import java.io.IOException;
import java.util.Iterator;
import java.util.StringTokenizer;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.MapWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.FileInputFormat;
import org.apache.hadoop.mapred.FileOutputFormat;
import org.apache.hadoop.mapred.JobClient;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;
import org.apache.hadoop.mapred.TextInputFormat;
import org.apache.hadoop.mapred.TextOutputFormat;
import org.elasticsearch.hadoop.mr.EsInputFormat;
import org.elasticsearch.hadoop.mr.EsOutputFormat;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;


public class TestDriver {

	public static class JSONMapper extends MapReduceBase 
	  implements Mapper<LongWritable, Text, LongWritable, MapWritable> {
		private JSONParser parser = new JSONParser();
		
		public void map(LongWritable key, Text value, 
				OutputCollector<LongWritable, MapWritable> output, Reporter reporter) throws IOException
		{
			String line = value.toString();
			try {
				JSONObject jsonObj = (JSONObject)parser.parse(line);
				MapWritable mw = new MapWritable();
				for (Object jskey: jsonObj.keySet()) {
					Text mapKey = new Text(jskey.toString());
					Text mapValue = new Text();
					if (jsonObj.get(jskey) != null) {
						mapValue.set(jsonObj.get(jskey).toString());
					}
					mw.put(mapKey, mapValue);
				}
				output.collect(key, mw);
			}catch (Exception e)
			{
				e.printStackTrace();
			}
		}
	}
	
	public static class WordCountMapper extends MapReduceBase 
	  implements Mapper<LongWritable, Text, Text, IntWritable> {
		private final static IntWritable one = new IntWritable(1);
		private Text word = new Text();
		
		public void map(LongWritable key, Text value, 
				OutputCollector<Text, IntWritable> output, Reporter reporter) throws IOException
		{
			String line = value.toString();
			StringTokenizer tokenizer = new StringTokenizer(line);
			
			while (tokenizer.hasMoreTokens())
			{
				word.set(tokenizer.nextToken());
				output.collect(word, one);
			}
		}
	}
	
	public static class WordCountReducer extends MapReduceBase 
	  implements Reducer<Text, IntWritable, Text, IntWritable> {
		public void reduce(Text key, Iterator<IntWritable> values,
			OutputCollector<Text, IntWritable> output, Reporter reporter) throws IOException
		{
			int sum = 0;
			while (values.hasNext())
			{
				sum += values.next().get();
			}
			output.collect(key,  new IntWritable(sum));
		}
	}
	
	public static void main(String[] args) {
		JobClient client = new JobClient();
		JobConf conf = new JobConf(TestDriver.class);

		//--For Identity or WordCount map-reducer
		//conf.setInputFormat(TextInputFormat.class);
		//conf.setOutputFormat(TextOutputFormat.class);

		//FileInputFormat.setInputPaths(conf, new Path("hdfs://localhost:9000/user/pliu/In"));
		//FileOutputFormat.setOutputPath(conf, new Path("hdfs://localhost:9000/user/pliu/Out"));

		//--Identity MapReducer
		//conf.setOutputKeyClass(LongWritable.class);
		//conf.setOutputValueClass(Text.class);

		//conf.setMapperClass(org.apache.hadoop.mapred.lib.IdentityMapper.class);
		//conf.setReducerClass(org.apache.hadoop.mapred.lib.IdentityReducer.class);

		//--WordCount MapReducer
		//conf.setOutputKeyClass(Text.class);
		//conf.setOutputValueClass(IntWritable.class);

		//conf.setMapperClass(WordCountMapper.class);
		//conf.setReducerClass(WordCountReducer.class);

		//--For elasticsearch-hadoop
		conf.set("es.resource", "appinsights/apm");
		//conf.set("es.nodes", "localhost");
		conf.set("es.port", "9220");
		conf.setSpeculativeExecution(false);
		
		conf.setInputFormat(TextInputFormat.class);
		conf.setOutputFormat(EsOutputFormat.class);

		FileInputFormat.setInputPaths(conf, new Path("hdfs://localhost:9000/user/pliu/InAPM"));
		
		conf.setOutputKeyClass(LongWritable.class);
		conf.setOutputValueClass(MapWritable.class);

		conf.setMapperClass(JSONMapper.class);
		
		//--Common
		client.setConf(conf);
		try {
			JobClient.runJob(conf);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
