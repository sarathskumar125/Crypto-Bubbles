import React, { useEffect, useState } from "react";
import axios from "axios";
import BubbleChart from "./Components/BubbleChart";
import "bootstrap/dist/css/bootstrap.css";
import Table from "react-bootstrap/Table";
import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

const App = () => {
  const [data2 ] = useState( localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data"))
  : []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/cryptocurrencies");
        localStorage.setItem('data', JSON.stringify(response.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  $(document).ready(function () {
    $("#Table_ID").DataTable();
  });

  const Data =
    data2.length > 0
      ? data2.map((d, index) => ({
          r:
            (d.market_cap / 1e9).toFixed(2) > 50
              ? (d.market_cap / 1e9).toFixed(2) / 6
              : (d.market_cap / 1e9).toFixed(2) > 10
              ? (d.market_cap / 1e9).toFixed(2) * 1
              : (d.market_cap / 1e9).toFixed(2) > 5
              ? (d.market_cap / 1e9).toFixed(2) * 4
              : (d.market_cap / 1e9).toFixed(2) >= 1
              ? (d.market_cap / 1e9).toFixed(2)* 10
              : (d.market_cap / 1e9).toFixed(2) * 60,
          title: d.symbol,
          imageSrc: d.image
        }))
      : { X: 0, y: 0, r: 0, title: "" };

  console.log(data2);

  return (
    <div style={{ maxWidth: '100%' }}>
 
           <BubbleChart data={Data} data2 = {data2} />
     

      <Table stripped bordered hover variant="dark" size="sm" id="Table_ID">
        <thead>
          <tr>
            <th width="100">#</th>
            <th width="400">Name</th>
            <th width="400">Price</th>
            <th width="400">Market Cap</th>
            <th width="600">24h Volume</th>
          </tr>
        </thead>
        <tbody>
          {data2.length > 0
            ? data2.map((coin, index) => (
                <tr key={coin.id}>
                  <td>{index + 1}</td>
                  <td>
                    {" "}
                    <img
                      src={coin.image}
                      alt=""
                      style={{ maxHeight: "20px" }}
                    ></img>{" "}
                    {coin.name}
                  </td>
                  <td> $ {coin.current_price}</td>
                  <td> $ {(coin.market_cap / 1e9).toFixed(2)} B</td>
                  <td>${(coin.total_volume / 1e6).toFixed(2)} M</td>
                </tr>
              ))
            : ""}
        </tbody>
      </Table>
    </div>
  );
};

export default App;
