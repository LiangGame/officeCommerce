//支付方式
export function paymentsFilter(value) {
  if (value == 1) {
    value = '支付宝'
  } else if (value == 2) {
    value = '微信'
  } else if (value == 3) {
    value = '银行卡'
  } else if (value == 4) {
    value = '余额'
  }else if (value == 5) {
    value = '迈达币'
  }
  return value;
}
//订单状态
export function payStatusFilter(value) {
  if (value == 0) {
    value = '未支付'
  } else if (value == 1) {
    value = '财务未确认'
  } else if (value == 2) {
    value = '已付款'
  } else if (value == 3) {
    value = '已返第一次佣金'
  } else if (value == 4) {
    value = '已返全部佣金'
  }else if (value == 5) {
    value = '已发货'
  }else if (value == 6) {
    value = '已收货'
  }
  return value
}
