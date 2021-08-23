function inputDis(e) {
    console.log(e.value);
    let userRes = document.getElementById('userRes')
    if (e.value == "admin") {
        userRes.disabled = false
        console.log("admin");
    } else {
        userRes.disabled = true
        console.log("customer");

    }
}
let resigter = () => {

    ///CHECK BOX//
    let userCheck = document.getElementsByName("userCheck")
    ////USER DETAILS INPUT////

    let userRes = document.getElementById("userRes")
    let userName = document.getElementById("userName")
    let userEmail = document.getElementById("userEmail")
    let userCountry = document.getElementById("userCountry")
    let userCity = document.getElementById("userCity")
    let userPassword = document.getElementById("userPassword")


    ////error HAndling ////
    let errorMsg = document.getElementById("errorMsg")
    let alertShow = document.getElementById("alertShow")


    /////firebase key ///
    let key = firebase.database().ref("/userDetails").push().key
    console.log(key);

    //user object goes to firebase/////
    let userObj;
    // console.log(userObj)





    let flag = false
    for (let i = 0; i < userCheck.length; i++) {
        if (userCheck[i].checked) {
            flag = true
            console.log("check", userCheck[i].value);
            ////ADMIN DATABASE////
            if (userCheck[i].value === "admin") {

                firebase.auth().createUserWithEmailAndPassword(userEmail.value, userPassword.value)
                    .then((userCredential) => {
                        // Signed in 
                        var user = userCredential.user;
                        console.log(user)

                        ////PUSH USER DATA IN FIREBASE DATABASE START////
                        userObj = {
                            uid: user.uid,
                            key: key,
                            type: userCheck[i].value,
                            userRes: userRes.value,
                            userName: userName.value,
                            userCountry: userCountry.value,
                            userCity: userCity.value,
                            userEmail: userEmail.value
                        }
                        firebase.database().ref("/myApp" + "/userDetails").child(user.uid).set(userObj)

                        ////PUSH USER DATA IN FIREBASE DATABASE END////


                        ///ALERT///
                        errorMsg.innerHTML = "SuccessFull SignUp..."
                        alertShow.className += " errorAlertShow"

                        setTimeout(() => {
                            alertShow.classList.remove("errorAlertShow")
                            window.location.assign("login.html")

                        }, 3000)
                        ////ALERT END////
                        // ...
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        errorMsg.innerHTML = errorMessage
                        alertShow.className += " errorAlertShow"
                        setTimeout(() => {
                            alertShow.classList.remove("errorAlertShow")


                        }, 3000)
                        // ..
                    });
            }
            ////////CUSTOMER USER DATABASE.....////////
            else {
                firebase.auth().createUserWithEmailAndPassword(userEmail.value, userPassword.value)
                    .then((userCredential) => {
                        // Signed in 
                        var user = userCredential.user;
                        console.log(user)

                        ////PUSH USER DATA IN FIREBASE DATABASE START////
                        userObj = {
                            uid: user.uid,
                            key: key,
                            type: userCheck[i].value,
                            userName: userName.value,
                            userCountry: userCountry.value,
                            userCity: userCity.value,
                            userEmail: userEmail.value

                        }
                        firebase.database().ref("/myApp" + "/userDetails").child(user.uid).set(userObj)

                        ////PUSH USER DATA IN FIREBASE DATABASE END////


                        ///ALERT///
                        errorMsg.innerHTML = "SuccessFull SignUp..."
                        alertShow.className += " errorAlertShow"
                        alertShow.style.backgroundColor = "lightgreen"
                        setTimeout(() => {
                            alertShow.classList.remove("errorAlertShow")


                        }, 3000)
                        ////ALERT END////
                        // ...
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        errorMsg.innerHTML = errorMessage
                        alertShow.className += " errorAlertShow"
                        alertShow.style.backgroundColor = "maroon"
                        alertShow.style.color = "white"
                        setTimeout(() => {
                            alertShow.classList.remove("errorAlertShow")


                        }, 3000)
                        // ..
                    })
            }

        }

        // /////USER AUTH/////

    }
    if (!flag) {
        console.log("not checked")
        alertShow.className += " errorAlertShow"
        alertShow.style.backgroundColor = "maroon"
        alertShow.style.color = "white"
        errorMsg.innerHTML = "Select Account type"
        setTimeout(() => {
            alertShow.classList.remove("errorAlertShow")


        }, 3000)
    }

}



//////SIGN UP AND LOGIN JS START/////
let login = () => {
    let userEmail = document.getElementById("userEmail")
    let userPassword = document.getElementById("userPassword")

    ///error HAndling ////
    let errorMsg = document.getElementById("errorMsg")
    let alertShow = document.getElementById("alertShow")

    firebase.auth().signInWithEmailAndPassword(userEmail.value, userPassword.value)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user.uid)
            sessionStorage.setItem("uid", user.uid)


            ///jump in page  admin panel and dashboard////
            firebase.database().ref("/myApp" + "/userDetails/").child(user.uid).on("value", (data) => {
                let userType = data.val().type

                if (userType === "admin") {
                    window.location.replace("./restaurent/adminPanel.html")
                } else {
                    window.location.replace("./customer/dashboard.html")
                }

            })

            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            errorMsg.innerHTML = errorMessage
            alertShow.className += " errorAlertShow"
            alertShow.style.backgroundColor = "maroon"
            alertShow.style.color = "white"
            setTimeout(() => {
                alertShow.classList.remove("errorAlertShow")


            }, 3000)
        });



}

//////SIGN UP AND LOGIN JS END/////




/////admin panel js start/////




function getUser() {
    let uid = sessionStorage.getItem("uid")
    let resName = document.getElementById("resName")
    let resUserNAme = document.getElementById("resUserNAme")
    let resEmail = document.getElementById("resEmail")
    let resCity = document.getElementById("resCity")
    let resCountry = document.getElementById("resCountry")

    firebase.database().ref("/myApp" + "/userDetails/").child(uid).on("value", (data) => {
        let { userName, userCountry, userCity, userEmail, userRes } = data.val()
        resName.innerHTML = "<b>Restaurent Name: </b>" + userRes
        resUserNAme.innerHTML = "<b>Name: </b>" + userName
        resEmail.innerHTML = "<b>Email: </b>" + userEmail
        resCity.innerHTML = "<b>City: </b>" + userCity
        resCountry.innerHTML = "<b>Country: </b>" + userCountry
        sessionStorage.setItem("resDet", JSON.stringify(data.val()))

    })

    setTimeout(()=>{
        pendingShow()
    
    },2000) 

}

/////admin panel js end/////





/////////CUSTOMER SITE JS start////////

/////////CUSTOMER SITE JS END////////



//////RESTAURENT PRODUCT JS START/////////

////SET PRODUCT IN DB//////
function addProduct() {
    let { userRes } = JSON.parse(sessionStorage.getItem("resDet"))
    let itemName = document.getElementById("itemName")
    let itemPrice = document.getElementById("itemPrice")
    // let prodCate = document.getElementById("prodCate")
    // let delMethod = document.getElementById("delMethod")
    ///DropDown Value Get////
    let cateOpt = document.getElementById("cateOpt")
    let cateOptValue = cateOpt.options[cateOpt.selectedIndex].value
    // console.log(cateOptValue);
    //RADIO BTN//
    let radioBtn = document.getElementsByName("deliveryMethod")
    let flag = false
    let radioBtnValue;
    for (let i = 0; i < radioBtn.length; i++) {
        if (radioBtn[i].checked) {
            flag = true
            radioBtnValue = radioBtn[i].value
        }
    } if (flag === false) {
        console.log("please check");
    }
    console.log(radioBtnValue);

    ////JAB SUB FIELD MAIN TEXT HO FIREBASE PR DATA JAYEGA/////
    if ((itemName.value.length > 5) && (itemPrice.value.length > 0)
        && !(cateOpt.selectedIndex === 0) && !(cateOpt.selectedIndex === 0)
        && (flag === true)) {
        let key = firebase.database().ref("/userDetails").push().key
        var prodObj = {
            key: key,
            itemName: itemName.value,
            itemPrice: itemPrice.value,
            prodCate: cateOptValue,
            delMethod: radioBtnValue,
            resName: userRes

        }
        firebase.database().ref("/myApp" + "/productItem").child(userRes).child(key).set(prodObj)
        console.log("Data SuccessFully Submit")
    } else {
        console.log("Please Submit All Product Fields");
    }


}


///GET PRODUCT IN DB////
function getProdInDB() {
    let prodShow = document.getElementById("prodShow")
    let userDes = JSON.parse(sessionStorage.getItem("resDet"))
    let html = ""
    firebase.database().ref("/myApp" + "/productItem").child(userDes.userRes).on("child_added", (data) => {
        let { itemName, itemPrice, prodCate, delMethod, resName } = data.val()
        console.log(data.val());
        html += `
        <section
            class="d-flex justify-content-center align-items-center
              col-md-3 col-sm-6 p-0">

            <section class="cards">
              <div class="cardImage">
                <img src="../img/product1.jpg" width="100%" alt="" />
              </div>
              <div class="cardDes">
                <h5>${itemName}</h5>
                <small>Rs:${itemPrice}</small>
                <small>Restaurent Name : ${resName}</small>
                <small>category: <strong>${prodCate}</strong></small>
                <p>DELIVERY: <strong>${delMethod}</strong></p>
              </div>
            </section>
          </section>
        `



        prodShow.innerHTML = html
    })
}

//////RESTAURENT PRODUCT JS END/////////






//////CUSTOMER SITE JS START/////

function getCustomer() {
    let uid = sessionStorage.getItem("uid")
    let cusName = document.getElementById("cusName")
    let cusEmail = document.getElementById("cusEmail")
    let cusCountry = document.getElementById("cusCountry")
    let cusCity = document.getElementById("cusCity")
    let prodShow = document.getElementById("prodShow")
    let html = ""
    ///get user details////
    firebase.database().ref("/myApp" + "/userDetails").child(uid).on("value", (data) => {
        let { userCity, userCountry, userName, userEmail } = data.val()
        cusName.innerHTML = "<b>Name: </b>" + userName
        cusEmail.innerHTML = "<b>Email: </b>" + userEmail
        cusCountry.innerHTML = "<b>Country: </b>" + userCountry
        cusCity.innerHTML = "<b>City: </b>" + userCity
    })


    ////GET ALL FOOD PRODUCT IN DB////

    firebase.database().ref("/myApp" + "/productItem").on("child_added", data => {
        let prodData = Object.values(data.val())
        prodData.map((val,ind) => {
            html += `
                <section
                class="d-flex justify-content-center align-items-center
                  col-md-3 col-sm-6 p-0">
    
                <section class="cards">
                  <div class="cardImage">
                    <img src="../img/product1.jpg" width="100%" alt="" />
                  </div>
                  <div class="cardDes">
                    <h5>${val.itemName}</h5>
                    <small>Rs:${val.itemPrice}</small>
                    <small>Restaurent Name : ${val.resName}</small>
                    <small>category: <strong>${val.prodCate}</strong></small>
                    <p>DELIVERY: <strong>${val.delMethod}</strong></p>
                    <button onclick="orderNow('${val.resName}','${val.key}')">ORDER!</button>
                  </div>
                </section>
              </section>
                ` })
            // console.log(html);
            prodShow.innerHTML = html
            // console.log(prodData);
    })


}



function orderNow(e,ind){
        console.log(e);
        console.log(ind);
    firebase.database().ref("/myApp"+ "/productItem").child(e).child(ind).on("value",data=>{
            let orderProd = data.val()
            console.log(orderProd);
    let key = firebase.database().ref("/myApp" + "/productItem").push().key
    firebase.database().ref("/myApp" + "/orders").child(key).set(
        {
            ...orderProd,
            state : "pending",
            key : key
        }
        )            


    })
}

//////CUSTOMER SITE JS END/////



//////pending prod show START////
function pendingShow(){
    let { userRes } = JSON.parse(sessionStorage.getItem("resDet"))
    let pendingProdShow = document.getElementById("pendingProdShow")
    let delProdShow = document.getElementById("delProdShow")
    let html = ""
    let html2 = ""
    let html3 = ""
    let acceptedProdShow = document.getElementById("acceptedProdShow")
    let orderDet = []
    firebase.database().ref("/myApp" + "/orders").on("value" , data=>{
        // console.log(Object.values(data.val()).map(value=>console.log(value)));
        
        let orderPending = Object.values(data.val());
        orderPending.map(val=>{
            if(val.state === "pending"){
                if(val.resName === userRes){
                    html +=`
            <section
                    class="d-flex justify-content-center align-items-center
                      col-md-3 col-sm-6 p-0">
        
                    <section class="cards">
                      <div class="cardImage">
                        <img src="../img/product1.jpg" width="100%" alt="" />
                      </div>
                      <div class="cardDes">
                        <h5>${val.itemName}</h5>
                        <small>Rs:${val.itemPrice}</small>
                        <small>Restaurent Name : ${val.resName}</small>
                        <small>category: <strong>${val.prodCate}</strong></small>
                        <p>DELIVERY: <strong>${val.delMethod}</strong></p>
                        <button onclick="acceptOrder('${val.resName}','${val.key}')">ACCEPT?</button>
                      </div>
                    </section>
                  </section>`
                  
                }
            }
            if(val.state === "accept"){
                if(val.resName === userRes){
                    html2 +=`
            <section
                    class="d-flex justify-content-center align-items-center
                      col-md-3 col-sm-6 p-0">
        
                    <section class="cards">
                      <div class="cardImage">
                        <img src="../img/product1.jpg" width="100%" alt="" />
                      </div>
                      <div class="cardDes">
                        <h5>${val.itemName}</h5>
                        <small>Rs:${val.itemPrice}</small>
                        <small>Restaurent Name : ${val.resName}</small>
                        <small>category: <strong>${val.prodCate}</strong></small>
                        <p>DELIVERY: <strong>${val.delMethod}</strong></p>
                        <button onclick="deliveredOrder('${val.resName}','${val.key}')">DELIVERED?</button>
                      </div>
                    </section>
                  </section>`
                  
                }
            }
            if(val.state === "delivered"){
                if(val.resName === userRes){
                    html3 +=`
            <section
                    class="d-flex justify-content-center align-items-center
                      col-md-3 col-sm-6 p-0">
        
                    <section class="cards">
                      <div class="cardImage">
                        <img src="../img/product1.jpg" width="100%" alt="" />
                      </div>
                      <div class="cardDes">
                        <h5>${val.itemName}</h5>
                        <small>Rs:${val.itemPrice}</small>
                        <small>Restaurent Name : ${val.resName}</small>
                        <small>category: <strong>${val.prodCate}</strong></small>
                        <p>DELIVERY: <strong>${val.delMethod}</strong></p>
                        <button>SUCCESS</button>
                      </div>
                    </section>
                  </section>`
                  
                }
            }
            
        })
        
        pendingProdShow.innerHTML = html
        acceptedProdShow.innerHTML = html2
        delProdShow.innerHTML = html3
        html = ""
        html2 = ""
        html3 = ""

    })
    
}




//////pending prod show END////

    /////accept btn function start/////

function acceptOrder(e,ind){
    // console.log(ind);
    let acceptObj = {}    
    firebase.database().ref("/myApp" + "/orders").child(ind).on("value",data=>{
        acceptObj = {
            ...data.val()
        }
        // console.log(acceptObj);
        firebase.database().ref("/myApp" + "/orders").child(ind).set({
                ...acceptObj,
                state:"accept"    
        })
        })

        
}

    /////accept btn function end/////

    ///////DELIVERED ORDER BTN start////
function  deliveredOrder(e,ind){

    let acceptObj = {}    
    firebase.database().ref("/myApp" + "/orders").child(ind).on("value",data=>{
        acceptObj = {
            ...data.val()
        }
        // console.log(acceptObj);
        firebase.database().ref("/myApp" + "/orders").child(ind).set({
                ...acceptObj,
                state:"delivered"    
        })
        })

}
    ///////DELIVERED ORDER BTN END////



    //////SIGN OUT FUNCTION/////
function signout(){
    firebase.auth().signOut().then(() => {
            window.location.replace("../index.html")
            sessionStorage.clear()
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}
   