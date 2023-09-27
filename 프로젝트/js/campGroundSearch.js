window.onload = ajax();
document.querySelector("#btnSearch").addEventListener("click", () => {
  ajax(document.querySelector("#txtSearch").value);
});

function ajax(keyword = "가평", gubun = "", pageNo = 1) {
  globalKeyword = keyword;
  globalGubun = gubun;
  globalPageNo = pageNo;
  let serviceKey =
    "hVVMVuTmCbA7r2MOOyDFItXgSn3eGaMpq9gp%2Ba99j0J0f8Cr%2FzUi%2F1gGdnf44QBuGhMmcoFrmyluc1%2BQR7LhoQ%3D%3D";
  let url = "https://apis.data.go.kr/B551011/GoCamping/searchList?";
  url += "&numOfRows=10";
  url += "&pageNo=" + pageNo;
  url += "&MobileOS=win&MobileApp=test";
  url += "&serviceKey=" + serviceKey;
  url += "&_type=json";
  url += "&keyword=" + globalKeyword;

  //1. XMLHttpRequest로 서버에 자료 요청하기
  //1-1. XMLHttpRequest 객체 생성
  const xhr = new XMLHttpRequest();

  //1-2. 요청 초기화
  xhr.open("GET", url, true);

  //1-3. 요청 전송 : 사용자 요청을 서버로 보낸다.
  xhr.send();

  // 2. 응답받은 자료 처리하기
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      if (gubun === "") {
        renderHTML(data);
      }
      if (gubun === "detail") {
        renderHTMLdetail(data);
      }
    }
  };
}

function renderHTML(data) {
  let dataBody = data.response.body;
  document.querySelector("#totalCount").innerHTML = dataBody.totalCount;

  if (dataBody.totalCount <= 0) {
    document.querySelector("ul").innerHTML = "";
    document.querySelector("#page").innerHTML = "";
    return;
  }
  let output = "<ul>";
  for (let i = 0; i < dataBody.items.item.length; i++) {
    output += `<li><a href="#" onclick="ajax(keyword = '${encodeURIComponent(
      dataBody.items.item[i].facltNm
    )}', gubun = 'detail')">${dataBody.items.item[i].facltNm}</a></li>`;
    // console.log(useData.items.item[i].facltNm);
    //console.log(output);
  }
  output += "</ul>";

  // 페이지
  let pageCnt = 0;
  if (dataBody.totalCount % 10 === 0) {
    pageCnt = dataBody.totalCount / 10;
  } else {
    pageCnt = parseInt(dataBody.totalCount / 10) + 1;
  }
  output += "<div id='page'>";
  for (let i = 1; i <= pageCnt; i++) {
    pageHtml = "";
    if (globalPageNo !== i) {
      pageHtml += `<a href="#" onclick="ajax(keyword='${globalKeyword}' , gubun = '', pageNo = ${i})">`;
      pageHtml += i;
      pageHtml += "</a>";
    } else {
      pageHtml += "<b>";
      pageHtml += i;
      pageHtml += "</b>";
    }
    pageHtml += "&nbsp;&nbsp;&nbsp;";
    output += pageHtml;
    // console.log(pageHtml);
  }
  output += "</div>";
  document.querySelector("#result").innerHTML = output;
}

function renderHTMLdetail(data) {
  let dataBody = data.response.body;
  const facltNm = dataBody.items.item[0].facltNm;
  const addr1 = dataBody.items.item[0].addr1;
  const homepage = dataBody.items.item[0].homepage;
  const intro = dataBody.items.item[0].intro;
  const mapX = dataBody.items.item[0].mapX;
  const mapY = dataBody.items.item[0].mapY;
  document.querySelector("#facltNm").innerHTML = facltNm;
  document.querySelector("#homepage").innerHTML = '<a href="' + homepage + '" target="_blank" id="hp">'+homepage+'</a>';
  document.querySelector("#addr1").innerHTML = addr1;
  document.querySelector("#intro").innerHTML = intro;
  renderMap(data);
}


function renderMap(data) {
  let dataBody = data.response.body;
  // console.log(document.getElementById("map"));
  const mapX = dataBody.items.item[0].mapX;
  const mapY = dataBody.items.item[0].mapY;
  var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(mapY, mapX), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

  var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

  // 마커가 표시될 위치입니다
  var markerPosition = new kakao.maps.LatLng(mapY, mapX);

  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: markerPosition,
  });

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);
 

  // 아래 코드는 지도 위의 마커를 제거하는 코드입니다
  // marker.setMap(null);
}
/*
function renderMap(data) {
  // Kakao Maps API 로드
  // Kakao API 키를 사용하여 로드해야 합니다.
  kakao.maps.load(function () {
    let dataBody = data.response.body;
    
    if (
      dataBody &&
      dataBody.items &&
      dataBody.items.item &&
      dataBody.items.item.length > 0
    ) {
      const mapX = dataBody.items.item[0].mapX;
      const mapY = dataBody.items.item[0].mapY;
      var mapContainer = document.getElementById("map"); // 지도를 표시할 div
      var mapOption = {
        center: new kakao.maps.LatLng(mapY, mapX), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

      var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      // 마커가 표시될 위치입니다
      var markerPosition = new kakao.maps.LatLng(mapY, mapX);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);

      // 아래 코드는 지도 위의 마커를 제거하는 코드입니다
      // marker.setMap(null);
    } else {
      console.error("Invalid data format.");
    }
  });
}*/