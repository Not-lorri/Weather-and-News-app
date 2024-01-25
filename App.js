import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";

function App() {

  // This is the weather component that will be rendered to the screen 
  const WeatherListComponent = () => {
    const [weatherData, setWeatherData] = useState([]);
    const apiKey = '04a4cc2e9e6d8cae63f542f2895fcd96'; // Replace with your OpenWeatherMap API key
    const city = 'Stockholm'; // Replace with your desired city
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
          );

          const dailyData = response.data.list.filter((item) => {
            const date = new Date(item.dt * 1000);
            return date.getUTCHours() === 12;
          });
          console.log(dailyData);
  
          setWeatherData(dailyData);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };
  
      fetchData();
    }, []);


    const renderItem = ({ item }) => (
      <View style={{ margin: 10}}>
        <Text style={{color: "#F8F4EC"}}>{getDayOfWeek(item.dt)}</Text>
        <Text style={{color: "#F8F4EC", fontSize: 14}}>Temperature: {Math.round(item.main.temp)}°C</Text>
        <Text style={{color: "#F8F4EC"}}>Description: {item.weather[0].description}</Text>
      </View>
    );


    const getDayOfWeek = (timestamp) => {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const date = new Date(timestamp * 1000);
      return daysOfWeek[date.getDay()];
    };
    

    return (
      <View>
        {weatherData.length > 0 ? (
          <FlatList
            data={weatherData}
            renderItem={renderItem}
            keyExtractor={(item) => item.dt.toString()}
            style={{
              padding: 10,
              marginVertical: 8,
              marginHorizontal: 16,
              color: "#F8F4ECf",
            }}
          />
        ) : (
          <Text>Loading weather data...</Text>
        )}
      </View>
    );
  };

  // This is the home screen
  const HomeScreen = () => {
    // This is the state hook that will store the data from the API call
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This is the API call
    useEffect(() => {
      // This is the function that will be called to fetch the data from the API call and store it in the state hook
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather?lat=59.3326&lon=18.0649&appid=04a4cc2e9e6d8cae63f542f2895fcd96&units=metric"
          );

          setData(response.data);
          setLoading(false);
          console.log(response.data);
        } catch (e) {
          setError(e);
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    // This is the loading message while the API call is being made
    if (loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Loading...</Text>
          <ActivityIndicator />
        </View>
      );
    }

    // This is the error message if the API call fails
    if (error) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>An error occurred</Text>
        </View>
      );
    }

    //Function to get current time
    const getCurrentTimeLocaly = () => {
      var date = new Date();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var ampm = hour >= 12 ? "pm" : "am";
      hour = hour % 12;
      hour = hour ? hour : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var currentTime = hour + ":" + minutes + " " + ampm;
      return currentTime;
    };
    

    // This is the main return statement that will be rendered to the screen
    return (
      <ScrollView style={{backgroundColor:"#40A2D8" }}>
        <View style={styles.container}>
          <View style={styles.container4}>
            <Text style={{ textAlign: "center", fontSize: 30, color: "#F5F7F8" , fontWeight: "bold"}}>
              {data.name} {data.sys.country}
            </Text>
            <Text style={{
                textAlign: "center",
                marginBottom: 10,
                fontSize: 20,
                color: "#F5F7F8",
              }}
            >
              {getCurrentTimeLocaly()}
            </Text>
            <Ionicons
              style={{
                textAlign: "center",
                margin: 10,
                fontSize: 200,
                color: "#F5F7F8",
              }}
              name="cloud-sharp"
            ></Ionicons>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 15,
                color: "#F5F7F8",
              }}
            >
              {data.weather[0].description}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 30, color: "#F5F7F8" }}>
              {Math.round(data.main.temp)} °C
            </Text>
          </View>
          <View style={styles.container3}>
            <Text
              style={{
                color: "#F5F7F8",
                margin: 10,
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Feels like: {data.main.feels_like} °C
            </Text>
            <Text
              style={{
                color: "#F5F7F8",
                margin: 10,
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Humidity: {data.main.humidity} %
            </Text>
            <Text
              style={{
                color: "#F5F7F8",
                margin: 10,
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Wind: {data.wind.speed} m/s
            </Text>
          </View>
        </View>
        
        <View style={styles.weatherContainer}>
          <Text style={styles.heading2}>Weather Forecast</Text>
          <WeatherListComponent />  
        </View>
     
      </ScrollView>
    );
  };

  // This is the news component 
  const NewsComponent = () => {
    const [newsData, setNewsData] = useState([]);
    const apiKey = 'c30e04ebd44a4a798faf3c8ea15f6e4d'; 
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
          );

          console.log(response.data.articles);
          setNewsData(response.data.articles);
        } catch (error) {
          console.error('Error fetching news data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const renderItem = ({ item }) => (
      // <TouchableOpacity onPress={NewsArticleCardAfterIsConnectedToNewsComponent(item.title)}>
      <TouchableOpacity onPress={() => openArticleUrl(item.url)}>  
        <View style={styles.newsItem}>
          <Image source={{uri: item.urlToImage}} style={{width: '100%', height: 200}} />
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
    
    const NewsArticleCardAfterIsConnectedToNewsComponent = (item) => {
      return (
        <View style={styles.newsItem}>
          <Image source={{uri: item.urlToImage}} style={{width: '100%', height: 200}} />
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDescription}>{item.description}</Text>
        </View>
      )
  
    };
    const openArticleUrl = (url) => {
      Linking.openURL(url);
    };
    

    return (
      <View>
        <Text style={styles.heading}>Top News</Text>
        {newsData.length > 0 ? (
          <FlatList
            data={newsData}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
            style={{marginBottom: 'auto'}}
          />
        ) : (
          <Text>Loading news data...</Text>
        )}
      </View>
    );
  };

  // This is the tab navigator 
  const Tab = createBottomTabNavigator();

  // This is the main return statement 
  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsComponent}
          options={{
            tabBarLabel: "News",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }

  // This is the main return statement that will be rendered to the screen (the tab navigator)
  return (
    <NavigationContainer>
      <MyTabs />
      <StatusBar />
    </NavigationContainer>
  );
}

export default App;

// This is the styling for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    // backgroundColor: "#54416d",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    // borderColor: "#54416d",
    height: 460,
  },
  container2: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
    justifyContent: "start",
    alignItems: "start",
  },
  container3: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  container4: {
    justifyContent: "flex-end",
    alignItems: "center",
    justifyContent: "start",
    alignItems: "start",
  },
  weatherContainer: { 
    flex: 1, 
    justifyContent: "flex-start", 
    // backgroundColor: "#E9F6FF" 
    backgroundColor: "#54416d",
    borderWidth: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: "#54416d",
    marginTop: 50,
    marginBottom:0,
    paddingTop: 20,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 1,
  },
  weatherText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "#fff",
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#0c6b0c",
    borderRadius: 30,
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
  },
  newsItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: "center",
  },

  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  newsDescription: {
    fontSize: 14,
    color: '#666',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    marginBottom: 30,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: "#F8F4EC"
  },
});
