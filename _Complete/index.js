import {
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as GlobalFunctions from '../../../Global/Functions';
import * as Globalstyles from '../../../Global/styles';
import * as GlobalAppInfo from '../../../Global/AppInfo';
import emtyCart from '../../../Assets/stay.png';
import ScreenNames from '../../../Global/ScreenNames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Complete = ({ orderCount, navigation }) => {
  const [orders, setOrders] = useState(null);
  const [showBranchName, setShowBranchName] = useState(false)
  useEffect(() => {
    if (orders == null) {
      AsyncStorage.getItem('adminBranch').then(Storagebranch => {
        GlobalFunctions.postData(
          `${GlobalAppInfo.App.apiPath}admin_order.php?id=4&branch=${Storagebranch}`,
        ).then(object => {
          // console.log({test:object.order })
          setOrders(object.order);
          setShowBranchName(Storagebranch == 'all')
        });
      });
    }
    
  }, []);
  const date = moment().format('DD-MM-YYYY');


  const CompleteView = () => {
    return orders.length > 0 ?  (
      orders.map((order, index) =>  ((date) == (order.order_placed_date.split(' ')[0]) || ((date) == (order.selfpickuptime.split(' ')[0]) && (date) != (order.order_placed_date.split(' ')[0]))) &&  (
        <TouchableOpacity
          key={index}
          style={[
            style.eachCointainer,
            {
              borderColor:
                order.total_price == 0
                  ? Globalstyles.color.oppositeColor
                  : Globalstyles.color.UIColor,
            },
          ]}
          onPress={() => {
            navigation.navigate(ScreenNames.OrderDetails, {
              orderId: order.id,
            });
          }}>
          {order.total_price == 0 && <Text style ={{color: Globalstyles.color.UIColor, textAlign: 'center', padding:5, fontSize:15, fontWeight: 'bold'}}>ENTERPRISE CUSTOMER</Text>}
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={style.textApp}>Order Number</Text>
            <Text style={style.textDot}>:</Text>
            <Text style={style.textApi}>{order.id}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={style.textApp}>Delivery Time</Text>
            <Text style={style.textDot}>:</Text>
            <Text style={style.textApi}>{order.selfpickuptime}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={style.textApp}>Total</Text>
            <Text style={style.textDot}>:</Text>
            <Text style={style.textApi}>
              {`\u20b9 `}
              {order.total_price}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={style.textApp}>PAYMENT</Text>
            <Text style={style.textDot}>:</Text>
            <Text style={style.textApi}>  {order.pay_id == 'Cash On Delivery'
                        ? 'Cash On Delivery'
                        : 'Online Payment'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={style.textApp}>Delivery Type</Text>
            <Text style={style.textDot}>:</Text>
            <Text style={style.textApi}>
              {(order.address == '00' || order.address == '0') ? 'Self Pickup' : 'Home Delivery'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={style.textApp}>Placed Time</Text>
            <Text style={style.textDot}>:</Text>
            <Text style={style.textApi}>{order.order_placed_date}</Text>
          </View>
          {(order.address != "00" || order.address != "0") &&
          <View
          style={{
            flexDirection: 'row',
          }}>
          <Text style={style.textApp}>Delivery Boy</Text>
          <Text style={style.textDot}>:</Text>
          <Text style={style.textApi}>{order.deliveryboyname}</Text>
        </View>
      }
          
          {showBranchName && <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={style.textApp}>Branch Name</Text>
            <Text style={style.textDot}>:</Text>
            <Text style={style.textApi}>{order.branchname}</Text>
          </View>}
        </TouchableOpacity>
      )) 
    ) : (
      <View style={style.exptyCartView}>
        <Image source={emtyCart} style={{ width: 300, height: 300 }} />
      </View>
    );
  };

  return (
    <View>
      {orders == null ? (
        <ActivityIndicator
          size={60}
          color={Globalstyles.color.UIColor}
          style={{
            alignItems: 'center',
            paddingTop: '50%',
          }}
        />
      ) : (
        <CompleteView />
      )}
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    width: Globalstyles.windowWidthPercentage(100),
  },
  eachCointainer: {
    width: Globalstyles.windowWidthPercentage(98),
    height: 'auto',
    margin: Globalstyles.windowWidthPercentage(1),
    padding: 5,
    borderWidth: 2,
    borderRadius: 5,
  },
  eachCointainerText: {
    fontSize: 14,
    color: Globalstyles.color.black,
    fontFamily: GlobalAppInfo.App.font,
  },
  exptyCartView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '30%',
  },
  textApp: {
    flex: 1,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.black,
  },
  textDot: {
    flex: 0.5,
    textAlign: 'center',
    color: Globalstyles.color.black,
  },

  textApi: {
    flex: 0.9,
    fontFamily: GlobalAppInfo.App.font,
    fontSize: 12,
    color: Globalstyles.color.blackLigh,
  },
});

export default Complete;
