<template>
    <div class="adv">
        <div class="title">
            <h2>В приложении быстрее и еще удобнее!</h2>
            <h6>Билеты на автобусы сразу у вас в телефоне, не нужно печатать билет</h6>
        </div>
        <div class="AdvContent">
            <div class="advInfo">
                <div class="advText">
                    <div class="inf">
                        <h6>Экономия</h6>
                        <p>Технологии в основе Атласа увеличивают эффективность работы наших партнёров. Поэтому мы можем делать цены ниже.</p>
                    </div>
                    <div class="inf">
                        <h6>Качество и контроль</h6>
                        <p>Мы контролируем работу водителей, состояние транспорта и работу сервиса. Мы неустанно трудимся над качеством услуг.</p>
                    </div>
                    <div class="inf">
                        <h6>Возврат без проблем</h6>
                        <p>Вернем 100% стоимости в течение 12 часов при отмене поездки более чем за сутки до отправления.</p>
                    </div>
                </div>
                <div class="advLink">
                    <div>
                        <a href="https://redirect.appmetrica.yandex.com/serve/819783099222126858?utm_source=atlas-morda&utm_medium=referral&utm_campaign=main-page-android">
                            <img src="../assets/store-android-1x.webp" alt="">
                        </a>
                    </div>
                    <div>
                        <a href="https://redirect.appmetrica.yandex.com/serve/747725502281743336?utm_source=atlas-morda&utm_medium=referral&utm_campaign=main-page-ios">
                            <img src="../assets//store-apple-1x.webp" alt="">
                        </a>
                    </div>
                    <div>
                        <a href="https://appgallery.huawei.com/app/C102892141">
                            <img src="../assets/store-huawei-1x.webp" alt="">
                        </a>
                    </div>
                </div>
            </div>
            <div class="advImg">
                <img src="../assets/download-app-banner-x1.webp" alt="">
            </div>
        </div>
    </div>
</template>

<script >
export default{

};

</script>

<style> 
.adv{
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.title{
    height: 10%;
}
.AdvContent{
    display: flex;
    justify-content: center;
    width: 57%;
    align-items: center;
}
.advText{
    width: 90%;
}
.advInfo{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.inf{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.advLink{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
h6:not(:last-child){
    font-size: 20px;
    margin: 0px;
    font-weight: bolder;
    color: black;
}
h6{
    font-size: 18px;
    margin: 0px;
}
p{
    text-align: left;
}
h2{
    color: black;
    font-size: 30px;
}
</style>
  