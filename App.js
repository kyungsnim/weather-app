import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";
import axios from "axios";

// openweathermap.org에서 회원가입 > 로그인하면 my page에 API key 를 확인할 수 있다.
const API_KEY = "241051bf13976dd3ddf8b8d9f247255e";
export default class App extends React.Component {
  state = {
    isLoading: true
  };

  // 날씨 정보 가져와서 저장해주는 부분
  getWeather = async (latitude, longitude) => {
    const { data: {
      main: { temp },
      weather
    } } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp
    });
  };

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync(); // 위치 허용할 것인지
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync(); // 현재 위치 가져오기
      this.getWeather(latitude, longitude);
      // latitude, longitude를 API로 보내서 날씨 정보를 가져올 것임 (https://openweathermap.org)
    } catch (error) {
      Alert.alert("Can't find you.", "So bad");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, condition, temp } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather condition={condition} temp={Math.round(temp)} />
    );
  }
}
