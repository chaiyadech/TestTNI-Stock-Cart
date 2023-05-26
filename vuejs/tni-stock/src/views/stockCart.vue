<template>
  <div>
    <h1>Stock Cart</h1>
    <!-- {{ myStock }} -->
    <div>
      <h3>MyStock</h3>
      <ul v-for="(item, index) in myStock" :key="index">
        <li>
          <p>{{ item.productName }}</p>
          <p>
            ราคา {{ addCommas(item.productPrice) }} บาท จำนวนคงเหลือ
            {{ item.productAmount }} เครื่อง
          </p>
          <input type="text" placeholder="ระบุจำนวน" :id="item.ID" />
          <button @click.prevent="addCart(item)">add Cart</button>
        </li>
      </ul>
    </div>
    <div>
      <h3>My Cart</h3>
      <p>รายการ</p>
      <table>
        <tr>
          <th>รหัสสินค้า</th>
          <th>ชื่อสินค้า</th>
          <th>ราคาต่อหน่วย</th>
          <th>จำนวน</th>
          <th>ราคารวม</th>
          <th>Action</th>
        </tr>

        <tr v-for="(item, index) in mycart" :key="index">
          <td>{{ item.productID }}</td>
          <td>{{ item.productName }}</td>
          <td>{{ addCommas(item.productPrice) }}</td>
          <td>{{ item.productAmount }}</td>
          <td>{{ addCommas(item.totalPrice) }}</td>
          <td>
            <button  @click.prevent="removebtn(item)">ลบรายการ</button>
            &nbsp;
            <input
             
              type="text"
              placeholder="ระบุจำนวนที่ต้องการลด"
              :id="'remove_' + item.productID"
            />
            <button @click.prevent="removeCart(item)">
              ตกลง
            </button>
          </td>
        </tr>

        <tr>
          <th colspan="3" style="text-align: right;">รวม</th>
          <th>{{ totalamount }}</th>
          <th>{{ addCommas(totalpricebill) }}</th>
          <th></th>
        </tr>
      </table>
    </div>
    <h3>ยอดชำระรวม {{ addCommas(totalpricebill) }} บาท</h3>
    <button @click.prevent="CheckOut()">CheckOut</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      mycart: [],
      myStock: [],
      remove: false,
    };
  },
  async mounted() {
    await this.getStock();
  },
  computed: {
    totalamount() {
      let tt = 0;
      if (this.mycart.length == 0) {
        return tt;
      } else {
        for (let item of this.mycart) {
          tt = tt + item.productAmount * 1;
        }
        return tt;
      }
    },
    totalpricebill() {
      let tt = 0;
      if (this.mycart.length == 0) {
        return tt;
      } else {
        for (let item of this.mycart) {
          tt = tt + item.totalPrice * 1;
        }
        return tt;
      }
    },
  },
  methods: {
    async getStock() {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/stock/getAllStock",
        headers: {},
      };

      var self = this;
      await axios
        .request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));

          self.myStock = response.data.mystock;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCommas(nStr) {
      nStr = Number.parseFloat(nStr).toFixed(2);
      // nStr = Math.floor(nStr).toFixed(2);
      //nStr = nStr.toFixed(2);

      nStr += "";
      var x = nStr.split(".");
      var x1 = x[0];
      var x2 = x.length > 1 ? "." + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      return x1 + x2;
    },
    addCart(items) {
      var amount = document.getElementById(items.ID).value;
      if (amount <= 0) {
        alert("กรุณาระบุจำนวน");
        return;
      }
      var inCart = [];

      if (this.mycart.length > 0) {
        // console.log(this.mycart);
        inCart = this.mycart.filter(
          (item) =>
            item.productID == items.ID && item.productName == items.productName
        );

        if (inCart.length > 0) {
          if (items.productAmount < inCart[0].productAmount * 1 + amount * 1) {
            alert("จำนวนสินค้าไม่เพียงพอ");
            return;
          } else {
            const index = this.mycart.findIndex(
              (item) =>
                item.productID == items.ID &&
                item.productName == items.productName
            );

            this.mycart[index] = {
              productID: items.ID,
              productName: items.productName,
              productPrice: items.productPrice,
              productAmount: (inCart[0].productAmount * 1 + amount * 1) * 1,
              totalPrice:
                items.productPrice * (inCart[0].productAmount * 1 + amount * 1),
            };
            alert("เพิ่มรายการสำเร็จ");
          }
        } else {
          if (items.productAmount >= amount) {
            this.mycart.push({
              productID: items.ID,
              productName: items.productName,
              productPrice: items.productPrice,
              productAmount: amount * 1,
              totalPrice: items.productPrice * (amount * 1),
            });
            alert("เพิ่มรายการสำเร็จ");
          } else {
            alert("จำนวนสินค้าไม่เพียงพอ");
            return;
          }
        }
      } else {
        if (items.productAmount >= amount) {
          this.mycart.push({
            productID: items.ID,
            productName: items.productName,
            productPrice: items.productPrice,
            productAmount: amount * 1,
            totalPrice: items.productPrice * (amount * 1),
          });
          alert("เพิ่มรายการสำเร็จ");
        } else {
          alert("จำนวนสินค้าไม่เพียงพอ");
          return;
        }
      }
      document.getElementById(items.ID).value = "";
    },
    removeCart(items) {
      //console.log(items);

      var amount = document.getElementById("remove_" + items.productID).value;
      if (amount <= 0) {
        alert("กรุณาระบุจำนวน");
        return;
      }
      // console.log(this.mycart);
      var inCart = [];
      inCart = this.mycart.filter(
        (item) =>
          item.productID == items.productID &&
          item.productName == items.productName
      );

      //console.log(inCart);
      if (inCart.length == 0) {
        alert("กรุณาลองใหม่");
        return;
      } else {
        if (inCart[0].productAmount <= amount) {
          const index = this.mycart.findIndex(
            (item) =>
              item.productID == items.productID &&
              item.productName == items.productName
          );
          // alert(index);
          if (index !== -1) {
            this.mycart.splice(index, 1);
            return true;
          }
        } else {
          const index = this.mycart.findIndex(
            (item) =>
              item.productID == items.productID &&
              item.productName == items.productName
          );
          this.mycart[index] = {
            productID: items.productID,
            productName: items.productName,
            productPrice: items.productPrice,
            productAmount: inCart[0].productAmount - amount,
            totalPrice: items.productPrice * (inCart[0].productAmount - amount),
          };
        }
      }
      document.getElementById("remove_" + items.productID).value = "";
      //alert(amount);
    },
    removebtn(items) {
        const index = this.mycart.findIndex(
            (item) =>
              item.productID == items.productID &&
              item.productName == items.productName
          );
          // alert(index);
          if (index !== -1) {
            this.mycart.splice(index, 1);
            return true;
          }
    },
    async getdata(result) {
      return;
    },
    async CheckOut() {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:3000/stock/getAllStock",
        headers: {},
      };

      var self = this;
      axios
        .request(config)
        .then((response) => {
          // console.log(JSON.stringify(response.data));

          var result = response.data.mystock;

          if (result.length <= 0) {
            alert("กรุณาลองใหม่");
          } else {
            if (self.mycart.length > 0) {
              //self.mycart
              var res = [];
              for (let items of self.mycart) {
                const d = result.filter((item) => item.ID === items.productID);

                res.push({
                  productID: items.productID,
                  productName: items.productName,
                  productAmount:
                    d[0].productAmount * 1 - items.productAmount * 1,
                });
              }

              let data = res;

              let config = {
                method: "put",
                maxBodyLength: Infinity,
                url: "http://localhost:3000/stock/checkOut",
                headers: {
                  "Content-Type": "application/json",
                },
                data: data,
              };

              axios
                .request(config)
                .then((response) => {
                  console.log(JSON.stringify(response.data));

                  alert("CheckOut Success");

                  window.location.reload();
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              alert("กรุณาระบุรายการ");
              return;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
