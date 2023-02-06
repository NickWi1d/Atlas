<template>
     <div class="search">
      <div class="params">
        <h1>Фильтр</h1>
        <div class="from">
          <p>Отправление из</p>
          <input type="text" placeholder="Любое" class="bigInput">
        </div>
        <div class="line"></div>
        <div class="to">
          <p>Отправление куда</p>
          <input type="text" placeholder="Любое" class="bigInput">
        </div>
        <div class="line"></div>
        <div class="from">
          <p>Тип автобуса</p>
          <input type="text" placeholder="Любой" class="bigInput">
        </div>
        <div class="line"></div>
        <div class="from">
          <p>Цена, $</p>
          <div class="price">
            <input type="text" placeholder="ОТ" class="bigInputfrom">
            <input type="text" placeholder="до" class="bigInputto">
          </div>
        </div>
        <div class="line"></div>
        <div class="from">
          <p>Дата</p>
          <input type="date" placeholder="Любой" class="bigInput">
        </div>
        <div class="remove">
          <img src="../assets/trash-can.png" alt="" id="trashcan">
          Очистить фильтр
        </div>
      </div>
      <div class="resaults">
        
      </div>
    </div>
</template>

<script >
export default{

};

</script>

<style> 
.search{
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: row;
}
.params{
  width: 20%;
  height: 100%;
  /* border: 1px solid; */
  display: flex;
  flex-direction: column;
  align-items:center;
}
.resaults{
  height: 100%;
  width: 85%;
  border-left: 1px solid;
}
.bigInput{
  width: 100%;
  height: 20%;
}
.from, .to{
  width: 80%;
  height: 15%;
  display: flex;
  flex-direction: column;
  align-items:flex-start;
}
.line{
  width: 80%;
  border-top:1px solid;
  margin: auto;
}
.bigInputfrom, .bigInputto{
  width: 45%;
  height: 35%;
}
.price{
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: space-between;
}

#trashcan{
  width: 5%;
  margin-right: 2%;
}
.remove{
  margin-bottom: 5%;
  width: 80%;
  display: flex;
  align-items:flex-start;
}
.remove:hover{
  color:black;
}
</style>