<script>
import * as path from 'path'

import { mapActions, mapState } from 'pinia'
import { useUserStore } from '../stores'

export default {
  data() {
    return {
      percentages: [5, 45, 50],
      tags: ['hello', 'test', 'test1'],
      width: document.documentElement.clientHeight * 0.2,
      height: document.documentElement.clientHeight * 0.2,
    }
  },
  computed: {
    ...mapState(useUserStore, ['mainMenuContent', 'modelMenuContent', 'ui', 'network', 'lobbyDir', 'dntpService', 'joinedGame', 'musicPlayer']),
    pieSize() {
      return {
        width: this.$refs.dodPie.clientWidth,
        height: this.$refs.dodPie.clientHeight,
      }
    },
    minimapBlowUp() {
      // console.log(this.network.minimapFileName.value)
      if (this.network.minimapFileName.value === '' || !this.network.minimapFileName.value)
        return './imgs/minimapSample.png'
      // console.log(`file://${path.join(this.lobbyDir, '/mapPreview/', this.network.minimapFileName.value)}`)
      const filePath = `file://${path.join(this.lobbyDir, '/mapPreview/', this.network.minimapFileName.value)}`
      return filePath
    },
    mapID2Name() {
      const id = this.network.joinedGame.value.mapId
      // console.log(this.network.joinedGame)
      // console.log(this.dntpService.id2NameCache)
      if (this.dntpService.id2NameCache.value[id] === undefined)
        return '-/-'

      return this.dntpService.id2NameCache.value[id]
    },
    pickedMod() {
      switch (this.network.joinedGame.value.mod) {
        case 'mod.sdd':
          return 'TYPE I'
        case 'arena.sdd':
          return 'TYPE II'
        case 'unitlevelup.sdd':
          return 'TYPE III'
        default:
          return 'TYPE I'
      }
    },
    isMapDlDone() {
      let allDone = true

      for (const player in this.network.joinedGame.value.players) {
        if (!this.network.joinedGame.value.players[player].hasmap)
          allDone = false
      }
      return allDone
    },
    meBeHabeMap() {
      return this.network.joinedGame.value.players[this.network.username.value].hasmap
    },
    ROLENAME() {
      let roleName = 'OPRT'
      // console.log(this.network.joinedGame.value)
      if (this.joinedGame.players[this.network.username.value].isSpec)
        roleName = 'SPEC'
      if (this.network.joinedGame.value.hoster === this.network.username.value)
        roleName += ', CRDT'

      return roleName
    },
  },

  updated() {

  },
  mounted() {
    this.musicPlayer.playSound('kaz.wav', true)
  },
  methods: {
    ...mapActions(useUserStore, ['setmainMenuContent', 'setmodalMenuContent', 'setactiveWindow']),
    viewDod() {
      this.setmainMenuContent('dod')
    },

    killGame() {
      this.network.killGame()
    },

    exitGame() {
      this.network.leaveGame()
    },

    viewModelTeam() {
      this.setmodalMenuContent('dod-p-game-team')
      this.setactiveWindow('modal')
    },

    viewModelMut() {
      this.setmodalMenuContent('dodPGameMutator')
      this.setactiveWindow('modal')
    },

    pickMap() {
      this.ui.getTextThroughGrabber('PICK MAP').then((resolve) => {
        this.ui.pushNewLoading('getSMap')
        this.dntpService.listMatchMap(resolve).then((ret) => {
          this.dntpService.retrieveMap(ret, this.lobbyDir).then(() => {
            this.ui.rmLoading('getSMap')
            this.ui.pushUINewNotif({ title: 'MAP', msg: 'SEARCH RESULT RETRIEVED', class: 'abc' })
          })
        })
      })
      this.ui.setmodalMenuContent('dodPGameMap')
      this.ui.setactiveWindow('modal')
    },
    startGame() {
      // console.log('trying to start game')
      this.network.startGame()
    },
    miJoin() {
      this.network.midJoin()
    },
  },
}
</script>

<template>
  <div class="dodPreGameWrapper">
    f
    <img id="quickFixNoPic" style="position:absolute;top:0;left:0%;width:1px;height:1px;" src="/imgs/minimapSample.png">
    <div class="dodPregame" style="position: absolute; top: 0px; left: 0px; width: 176vw; height: 100%; perspective: 2vh; overflow: hidden;">
      <div class="dodPregameBg" style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;background:#989ba1;">
        <img src="/imgs/blueprintswblue.png" style="position:absolute;width:100%;height:100%;filter:grayscale(100%) invert(80%);opacity:0.1;"><div class="grid" style="background-size:15vh 15vh;background-image:linear-gradient(to right, grey 1px, transparent 1px),linear-gradient(to bottom, grey 1px, transparent 1px);position:absolute;width:100%;height:100%;opacity:0.5;"></div><div class="grid" style="background-size:14vh 7vh;background-image:radial-gradient(circle, #ffffff6e 1px, rgba(0, 0, 0, 0) 1px);position:absolute;width:100%;height:100%;top:7%;left:1%;"></div><div class="grid" style="background-size:7vh 7vh;background-image:radial-gradient(circle, #00000036 1px, rgba(0, 0, 0, 0) 1px);position:absolute;width:150%;height:100%;"></div>
      </div>
      <div class="dodCenterInfoPanel" style="position: absolute; bottom: 0%;  width: 90%; left: 5%; top: 0%;filter: grayscale(100%);mix-blend-mode:screen;">
        <img :src="minimapBlowUp" style="-webkit-mask-image: linear-gradient(90deg, #0000ff00, green 9%, green 91%, #ff000000);width:100%;height:100%;">
      </div>
      <div class="dodBtmInfoPanel" style="position: absolute; bottom: 7%; height: 15vw; width: 87%; left: 13vw; background: rgba(255, 255, 255, 0.65); transform: rotateX(0.3deg);">
        <div class="dodBtmInfoPanelDecro" style="position:absolute;bottom:9%;height:12vw;width:0.25%;left:-0.25%;background:#2196f3;"></div>
        <div class="dodBtmInfoPanelDecro" style="position:absolute;bottom:9%;height:12vw;width:0.25%;left:100%;background:#2196f3;"></div>
        <div class="vote" style="position:absolute;bottom:9%;height:12vw;width:20.2vw;left:0.8vw;overflow:hidden;color:#000000a8;font-family:'font4';font-size: 0.8vw;overflow-y:auto;padding-right:2vw;" data-v-0516f4a8="">
          <div class="individualVote" style="position:relative;width:100%;padding-top:1vh;" data-v-0516f4a8="">
            <details style="position:relative;padding-bottom: 1.2vw;" data-v-0516f4a8="">
              <summary style="font-size: 0.9vw;" data-v-0516f4a8="">
                ?(Y/n) Change Map To Comet Catcher Redux
              </summary><p data-v-0516f4a8="">
                This will change the map of this operation to the map named comet catcher redux. After enought vote passed, the map change will happen. Without enought votes, the operation might be conducted with the current map.
              </p>
            </details><div class="voteBarBg" style="position:absolute;bottom:0;width:100%;background:#00000052;height:0.2vh;" data-v-0516f4a8=""></div><div class="voteBar" style="position:absolute;bottom:0;width:52%;background:#6e6e6e;height: 0.5vw;" data-v-0516f4a8=""></div><div style="position:absolute;bottom:0vh;right:0;" data-v-0516f4a8="">
              Y
            </div>
          </div><div class="individualVote" style="position:relative;width:100%;padding-top:1vh;" data-v-0516f4a8="">
            <details style="position:relative;padding-bottom: 1.2vw;" data-v-0516f4a8="">
              <summary style="font-size: 0.9vw;" data-v-0516f4a8="">
                ?(Y/n) Change Map To Comet Catcher Redux
              </summary><p data-v-0516f4a8="">
                This will change the map of this operation to the map named comet catcher redux. After enought vote passed, the map change will happen. Without enought votes, the operation might be conducted with the current map.
              </p>
            </details><div class="voteBarBg" style="position:absolute;bottom:0;width:100%;background:#00000052;height:0.2vh;" data-v-0516f4a8=""></div><div class="voteBar" style="position:absolute;bottom:0;width:52%;background:#6e6e6e;height: 0.5vw;" data-v-0516f4a8=""></div><div style="position:absolute;bottom:0vh;right:0;" data-v-0516f4a8="">
              Y
            </div>
          </div><div class="individualVote" style="position:relative;width:100%;padding-top:1vh;" data-v-0516f4a8="">
            <details style="position:relative;padding-bottom: 1.2vw;" data-v-0516f4a8="">
              <summary style="font-size: 0.9vw;" data-v-0516f4a8="">
                ?(Y/n) Change Map To Comet Catcher Redux
              </summary><p data-v-0516f4a8="">
                This will change the map of this operation to the map named comet catcher redux. After enought vote passed, the map change will happen. Without enought votes, the operation might be conducted with the current map.
              </p>
            </details><div class="voteBarBg" style="position:absolute;bottom:0;width:100%;background:#00000052;height:0.2vh;" data-v-0516f4a8=""></div><div class="voteBar" style="position:absolute;bottom:0;width:52%;background:#6e6e6e;height: 0.5vw;" data-v-0516f4a8=""></div><div style="position:absolute;bottom:0vh;right:0;" data-v-0516f4a8="">
              Y
            </div>
          </div><div class="individualVote" style="position:relative;width:100%;padding-top:1vh;" data-v-0516f4a8="">
            <details style="position:relative;padding-bottom: 1.2vw;" data-v-0516f4a8="">
              <summary style="font-size: 0.9vw;" data-v-0516f4a8="">
                ?(Y/n) Change Map To Comet Catcher Redux
              </summary><p data-v-0516f4a8="">
                This will change the map of this operation to the map named comet catcher redux. After enought vote passed, the map change will happen. Without enought votes, the operation might be conducted with the current map.
              </p>
            </details><div class="voteBarBg" style="position:absolute;bottom:0;width:100%;background:#00000052;height:0.2vh;" data-v-0516f4a8=""></div><div class="voteBar" style="position:absolute;bottom:0;width:52%;background:#6e6e6e;height: 0.5vw;" data-v-0516f4a8=""></div><div style="position:absolute;bottom:0vh;right:0;" data-v-0516f4a8="">
              Y
            </div>
          </div>
        </div>
        <div class="voteSearch" style="position:absolute;bottom:15%;padding-top:3%;padding-right:1%;padding-left:1%;padding-bottom:3%;left:24.8vw;overflow:hidden;background:#545454;font-size:2vw;filter:drop-shadow(8px 8px 6px #545454);mix-blend-mode:multiply;">
          <i class="fa fa-search" aria-hidden="true"></i>
        </div>
        <div class="teamPrediction" style="position: absolute; bottom: 15%; width: 40%; left: 33.8vw; overflow: hidden; font-size: 2vw; filter: drop-shadow(rgb(84, 84, 84) 8px 8px 6px); height: 73%;">
          <div class="bg" style="position: absolute; width: 100%; height: 100%; background: rgb(133, 133, 133);opacity:0.5">
            <div style="position: absolute; font-weight: 900; font-size: 10vw; top: -17%; font-family: font1; left: -6%; color: rgba(0, 0, 0, 0.2);">
              予測
            </div><div style="position: absolute; font-weight: 900; font-size: 6vw; top: 32%; font-family: font3; left: 8%; color: rgb(255, 255, 255);">
              40%
            </div><div style="position: absolute; font-weight: 900; font-size: 2vw; top: 9%; font-family: font5; left: 3%; color: rgb(0, 0, 0); background: rgb(255, 255, 255); padding-left: 1vw; padding-right: 1vw; mix-blend-mode: screen;">
              Prediction
            </div>
          </div>
          <div ref="dodPie" class="pieChart" style="position: absolute; top: 0%; margin: 0px; left: 35%; width: 20vh; height: 20vh;">
            <pie :percentages="percentages" :tags="tags" />
          </div>
          <div class="deploymentComposition" style="position:absolute;left:73%;height:100%;width:25%;">
            <div style="position:absolute;bottom:0%;font-family:'font9';font-weight:900;color: #5050502b;font-size:5vw;right:0;">
              COMPOSITION
            </div>
            <div class="compositionContent" style="position:absolute;height:100%;width:100%;">
              <div class="compositionTeam1" style="position:relative;width:100%;margin-bottom: 12%;">
                <div class="compositionTeam1Header" style="position:absolute;font-weight:900;font-family: 'font4';font-size: 2vw;opacity:0.5;left: -20%;">
                  <span style="color: #b5b5b5;">0</span>1
                </div><div class="compositionTeam1Header" style="font-weight:900;font-family: 'font9';font-size: 1vw;top: -4%;padding:0;margin:0;color: white;">
                  TEAM A
                </div><div class="compositionTeam1Content" style="position:relative;margin:0;padding:0;height:0;top: -0.7vw;">
                  <div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.1);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.5);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.8);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.2);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.7);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.5);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.9);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.5);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.3);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.7);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.6);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.4);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.7);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.9);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:white;"></div>
                </div>
              </div><div class="compositionTeam1" style="position:relative;width:100%;">
                <div class="compositionTeam1Header" style="position:absolute;font-weight:900;font-family: 'font4';font-size: 2vw;opacity:0.5;left: -20%;">
                  <span style="color: #b5b5b5;">0</span>2
                </div><div class="compositionTeam1Header" style="font-weight:900;font-family: 'font9';font-size: 1vw;top: -4%;padding:0;margin:0;color: white;">
                  TEAM B
                </div><div class="compositionTeam1Content" style="position:relative;margin:0;padding:0;height:0;top: -0.7vw;">
                  <div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.1);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.5);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.8);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.2);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.7);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.5);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.9);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.5);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.3);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.7);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.6);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.4);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.7);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:rgba(255,255,255,0.9);"></div><div style="position:relative;display:inline-block;height:1vw;width:1vw;background:white;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dodPanelRight" style="position: absolute; right: 0px; color: black; font-size: 5vw; font-family: font1;width: 51%; height: 100%;">
          <div class="pGameUserOperation" style="position: absolute; height: 100%; width: 9%; left: 45%;opacity: 0.3;">
          </div>
        </div>
      </div>
      <div class="dodLeftOperationPanel" style="position: absolute; bottom: 32%; height: 81vh; width: 72vh; left: 22vw; ">
        <div style="font-size: 16vh; -webkit-text-stroke: 0.2vh rgb(84 84 84 / 16%); font-family: font5; text-align: right; color: rgb(255 255 255 / 53%); top: 4%; position: absolute; right: 0px;font-weight:900;">
          Dr. {{ network.username }}
        </div>
        <div style="font-size: 3vh; text-align: right; color: rgba(255, 255, 255, 0.85); top: 14%; position: absolute; left: 0px; background: rgb(88, 88, 88); filter: drop-shadow(rgb(0, 0, 0) 30px 10px 18px); padding: 0.6vh;font-family: font10;">
          {{ ROLENAME }}
        </div>
        <div style="position: absolute; top: 25%; width: 69%; background: rgb(33, 150, 243); font-family: font5; font-size: 4vh; text-align: right; filter: drop-shadow(rgba(33, 150, 243,0.4) 12px 15px 2.8px);padding-right: 1.9%;padding-top: 2%;height:5.5vh;overflow:hidden;cursor:pointer;" @click.stop="pickMap">
          {{ mapID2Name }}
        </div>
        <div v-if="isMapDlDone" style="position:absolute;height: 8.6%;width:15%;background: rgb(33 150 243 / 0%);overflow: hidden;top: 25%;left:10%;">
          <img src="/imgs/done.png" class="mapAllDone" style="position: absolute; top: -13%; width: 100%;  font-family: font5; font-size: 4vh; text-align: right; filter: drop-shadow(rgba(33, 150, 243, 0.4) 12px 15px 2.8px);">
        </div>
        <div v-if="!meBeHabeMap" style="position: absolute; height: 2.2%; width: 15%; background: rgb(255 255 255); overflow: hidden; top: 25.5%;color:#2196f3;text-align:right;padding-right: 1%;left: 2%;font-family: font5;font-size:1.6vh;">
          LOADING
        </div>
        <div v-if="meBeHabeMap&&!isMapDlDone" style="position: absolute; height: 2.2%; width: 15%; background: rgb(255 255 255); overflow: hidden; top: 25.5%;color:#2196f3;text-align:right;padding-right: 1%;left: 2%;font-family: font5;font-size:1.6vh;">
          CHANGING
        </div>
        <div v-if="isMapDlDone" class="mapAllDone2" style="position: absolute; height: 2.2%; width: 15%; background: rgb(255 255 255); overflow: hidden; top: 25.5%;color:#2196f3;text-align:right;padding-right: 1%;font-family: font5;font-size:1.6vh;">
          READY
        </div>
        <div data-v-0516f4a8="" style="position: absolute; top: 25%; width: 28.8%; background: rgb(255 255 255); font-family: font5; font-size: 4vh; text-align: right; filter: drop-shadow(rgba(255, 255, 255,0.5) 12px 15px 2.8px);right:0;color:black;mix-blend-mode:screen;padding-top: 2%;padding-right: 0.5%;cursor:pointer;" @click.stop="viewModelMut">
          {{ pickedMod }}
        </div><div class="mapTags" data-v-0516f4a8="" style="position: absolute; top: 37%; width: 100%; padding: 0vh; font-size: 3vh; text-align: right; font-family: font10; font-weight: 900; opacity: 0.9;filter: drop-shadow(rgb(0, 0, 0) 30px 10px 18px);">
          <span data-v-0516f4a8="" style="background: rgb(92, 92, 92); padding: 0.8vh; margin: 2vh; color: rgba(255, 255, 255, 0.88);">FLAT</span><span data-v-0516f4a8="" style="background: rgb(92, 92, 92); padding: 0.8vh; margin: 2vh; color: rgba(255, 255, 255, 0.88);">WATER</span>
        </div><div style="position:absolute;left:0;width:0.4vw;height: 15%;background:#2196f3;filter: drop-shadow(rgba(33, 150, 243,0.5) 12px 15px 2.8px);top: 48%;" data-v-0516f4a8=""></div>
        <div class="teamSetUp" data-v-0516f4a8="" style="position: absolute; top: 48%; height: 12vh; width: 40%; overflow: hidden;filter: drop-shadow(rgba(0, 0,0, 0.4) 30px 10px 18px);left: -3%;cursor:pointer;" @click.stop="viewModelTeam">
          <div style="position:absolute;left:18%;width:100%;height:100%;font-size:4vh;font-family:font1;background: #545454d9;top:0%;" data-v-0516f4a8=""></div><div style="position:absolute;left:24%;width:100%;height:100%;font-size:4vh;font-family:font1;top:-2%;" data-v-0516f4a8="">
            配備
          </div><div style="position:absolute;left:24%;width:100%;height:100%;font-size:4vh;font-family: 'font1';top: 62%;" data-v-0516f4a8="">
            35/35
          </div><div style="position:absolute;left:24%;width:100%;height:100%;font-size:2vh;font-family: 'font10';font-weight:900;opacity:0.5;top: 45%;" data-v-0516f4a8="">
            DEPLOYMENTS
          </div><i class="fa fa-pencil-square-o" aria-hidden="true" style="position:absolute;left:73%;width:100%;height:100%;font-size:9vh;top:45%;opacity:0.5;" data-v-0516f4a8=""></i>
        </div>
        <div class="mutatorSetUp" data-v-0516f4a8="" style="position: absolute; top: 48%; height: 12vh; width: 40%; overflow: hidden; left: 39%;filter: drop-shadow(rgba(0, 0,0, 0.4) 30px 10px 18px);cursor:pointer;" @click.stop="viewModelMut">
          <div style="position:absolute;left:17%;width:100%;height:100%;font-size:4vh;font-family:font1;background: #545454d9;top:0%;" data-v-0516f4a8=""></div><div style="position:absolute;left:24%;width:100%;height:100%;font-size:4vh;font-family:font1;top:-2%;" data-v-0516f4a8="">
            指揮系統
          </div><div style="position:absolute;left:24%;width:100%;height:100%;font-size:4vh;font-family: 'font1';top: 62%;" data-v-0516f4a8="">
            4/4
          </div><div style="position:absolute;left:24%;width:100%;height:100%;font-size:2vh;font-family: 'font10';font-weight:900;opacity:0.5;top: 45%;" data-v-0516f4a8="">
            CMD SYS
          </div><i class="fa fa-pencil-square-o" aria-hidden="true" style="position:absolute;left:73%;width:100%;height:100%;font-size:9vh;top:45%;opacity:0.5;" data-v-0516f4a8=""></i>
        </div>
      </div>
      <div class="dodRightOperationPanel" style="position: absolute; bottom: 61vh; height: 65vh; width: 60vh; right: 52vh;">
        <div class="pGameUserOperationTtl" style="position:absolute;width:100%;top:66%;left: -21%;mix-blend-mode:screen;">
          <div style="font-size:25vh;font-family:'font5';opacity:0.3;font-weight:900;">
            作業
          </div><p style="position:absolute;background:black;color:white;top:52%;left:10%;font-size:4vh;font-family:font1;">
            TEST
          </p>
        </div>
        <div class="pGameUserOperationTitle" style="position:absolute;height:45%;width:100%;top:56%;left:17%;mix-blend-mode:screen;">
          <div style="width:100%;height:1%;background: #ffffff61;top:32%;position:absolute;right:0;"></div>
          <p style="position:absolute;background:black;color:white;top:-2%;left:43%;font-size:4vh;font-family:'font2';">
            OPERATIONS
          </p>
        </div>
        <div class="noncanonicalOpts" style="position: absolute; top: 62%; width: 100%; right: -33%;height:40%;filter: drop-shadow(15px 20px 8px rgba(0,0,0,0.5));">
          <!--<img src="/imgs/btlop3.png" style="position:absolute;width:45%;">-->
          <img src="/imgs/btlop2.png" style="position: absolute; width: 45%; left: 26%;cursor:pointer;" @click="viewDod">
          <img src="/imgs/btlop4.png" style="position: absolute; width: 28.1%; left: 61%;top: 16.7%;cursor:pointer;" @click="killGame">
        </div>
        <div class="pGameUserOperation" style="position: absolute; height: 14.1%; width: 40%; left: 77%; overflow:hidden; background: #2196f3;top: 94.6%;filter:drop-shadow(8px 8px 6px #545454);cursor:pointer;" @click="startGame">
          <div data-v-0516f4a8="" style="position: absolute; font-size: 6vh; top: 28%; left: 11%; color: rgba(255, 255, 255, 0.78); font-family: font2; font-weight: 100;">
            INIT
          </div><div data-v-0516f4a8="" style="position: absolute; font-size: 2vh; top: 11%; left: 13%; color: white; font-family: font5; font-weight: 900; background: black; mix-blend-mode: screen;">
            OPERATION
          </div><img src="/imgs/btlop1.png" data-v-0516f4a8="" style="position: absolute; height: 204%; top: -28%; left: 39%; opacity: 0.2;">
        </div>
        <div class="pGameUserOperation" style="position: absolute; height: 14.1%; width: 40%; left: 34%; overflow:hidden;; background: #545454;top: 94.6%;filter:drop-shadow(8px 8px 6px #545454);cursor:pointer;" @click="exitGame">
          <div style="position:absolute;font-size: 6vh;top: 28%;left: 11%;color: #ffffffc7;font-family: font2;font-weight: 100;">
            HALT
          </div>
          <div style="position:absolute;font-size: 2vh;top: 11%;left: 13%;color: white;font-family: font5;font-weight:900;background: black;mix-blend-mode: screen;">
            OPERATION
          </div>
          <img src="/imgs/btlop3.png" style="position: absolute; height: 204%; top: -28%; left: 39%;opacity: 0.2;">
        </div>
      </div>
    </div>
    <div v-if="joinedGame.isStarted" class="btlInProgrs" style="position:absolute;width:100%;left:0%;height:15%;bottom:7%; overflow:hidden">
      <div class="bg" style="position:absolute;top:0%;width:100%;height:100%;background:#484848e6;backdrop-filter:blur(4px);" data-v-0516f4a8="">
        <div class="stripy1" style="position:absolute;top:25%;width:100%;overflow:hidden;height:42%;left:100%;" data-v-0516f4a8="">
          <div style="position:absolute;width:100%;height:100%;background:repeating-linear-gradient(56deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 27px, rgba(255, 255, 255, 1) 27px, rgb(255 255 255) 50px);opacity:0.8;left:0%;" data-v-0516f4a8=""></div>
        </div><div class="stripy2" style="position:absolute;top:25%;width:100%;overflow:hidden;height:42%;left:100%;mix-blend-mode:screen;" data-v-0516f4a8="">
          <div style="position:absolute;width:80%;height:100%;background:repeating-linear-gradient(56deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 27px, rgba(255, 255, 255, 1) 27px, rgb(255 255 255) 50px);opacity:0.8;left:10%;" data-v-0516f4a8=""></div><div style="width:10%;height:100%;background:black;filter:invert(100%);position:absolute;" data-v-0516f4a8="">
            <div style="position:absolute;font-size:2.9vh;font-family:font2;color:white;top:1%;" data-v-0516f4a8="">
              OPERATION <br data-v-0516f4a8="">IN PROGRESS
            </div><div style="position:absolute;width:100%;top:74%;height:0.3vh;background:white;" data-v-0516f4a8=""></div><div style="position:absolute;font-size:2vh;font-family:font5;color:white;top:78%;width:100%;text-align:left;font-weight:900;" data-v-0516f4a8="">
              ETA 1 HR, 30 MIN, and 4 SEC
            </div>
          </div><div style="position:absolute;width:10%;height:100%;right:0%;" data-v-0516f4a8="">
            <div style="position:absolute;font-size:2.9vh;font-family:font2;color:white;top:1%;" data-v-0516f4a8="">
              OPERATION <br data-v-0516f4a8="">IN PROGRESS
            </div><div style="position:absolute;width:100%;top:74%;height:0.3vh;background:white;" data-v-0516f4a8=""></div><div style="position:absolute;font-size:2vh;font-family:font5;color:white;top:78%;width:100%;text-align:left;font-weight:900;" data-v-0516f4a8="">
              ETA 1 HR, 30 MIN, and 4 SEC
            </div>
          </div>
        </div>
      </div><div class="rejoin" style="position:absolute;top:26%;height:40%;background:#767676;left:39%;width:22%;filter:drop-shadow(23px 16px 10px rgba(0,0,0,0.5));" data-v-0516f4a8="">
        <div style="position:absolute;top:0%;height:100%;background:#767676;left:0%;width:29%;filter:drop-shadow(9px 6px 10px rgba(255,255,255,0.5));overflow:hidden;cursor:pointer;" @click="miJoin">
          <img src="/imgs/merge.svg" style="transform:rotate(90deg);filter:invert(100%);height:16vh;opacity:0.2;top:-22%;position:absolute;" data-v-0516f4a8=""><div style="top:24%;font-size:3.1vh;font-family:font5;overflow:hidden;right:0%;position:absolute;font-weight:900;color:#ffffffe6;" data-v-0516f4a8="">
            JOIN<br data-v-0516f4a8=""> OPERATION
          </div>
        </div><div style="position:absolute;top:0%;height:100%;left:30%;width:70%;overflow:hidden;" data-v-0516f4a8="">
          <div style="position:absolute;top:13%;width:8vh;height:8vh;overflow:hidden;left:82%;" data-v-0516f4a8="">
            <div style="top:13%;font-size:4vh;font-family:font5;overflow:hidden;right:33.6%;position:absolute;font-weight:900;color:#ffffffe6;" data-v-0516f4a8="">
              A
            </div><img class="spinningIcon" src="/imgs/rotat.png" style="position:absolute;height:99%;left:0%;top:0%;" data-v-0516f4a8="">
          </div><div style="top: 17%;font-size: 2.3vh;font-family:font5;overflow:hidden;right:23.8%;position:absolute;font-weight:900;color:#ffffffe6;" data-v-0516f4a8="">
            OPERATION IN PROGRESS
          </div><div style="top: 50%;font-size:1.3vw;font-family:font5;overflow:hidden;position:absolute;font-weight:900;color:#ffffffe6;background:#707070;width:65%;height:3.8%;left:9%;" data-v-0516f4a8=""></div><div style="top: 64%;font-size:1.6vh;font-family:font9;overflow:hidden;right:24%;position:absolute;font-weight:900;color:#ffffffe6;" data-v-0516f4a8="">
            REJOIN AVAILABLE
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.mapAllDone{
  animation-fill-mode: forwards;
  animation-name: mapAllDone;
  animation-duration: 0.6s;
  animation-iteration-count: 1;
  animation-delay: 0.2s;
  opacity: 0;
  animation-timing-function: cubic-bezier(0.95, 0, 0.24, 0.88);
}
.mapAllDone2{
  animation-fill-mode: forwards;
  animation-name: mapAllDone2;
  animation-duration: 0.6s;
  animation-iteration-count: 1;
  animation-delay: 0s;
  opacity: 0;
  animation-timing-function: cubic-bezier(0.95, 0, 0.24, 0.88);
}
@keyframes mapAllDone {

  0% {
    opacity: 0;
    left:-20%;
  }
  100% {
    opacity: 20%;
    left:0;
  }
}
@keyframes mapAllDone2 {

  0% {
    opacity: 0;
    left:-1%;
  }
  100% {
    opacity: 1;
    left:2%;
  }
}
.spinningIcon{
 animation-fill-mode: forwards;
 animation-name: spinningIconAni;
 animation-duration: 6s;
 animation-iteration-count: infinite;
 animation-delay:1s;
}

@keyframes spinningIconAni {

 0%   {transform: rotate(0deg); }
 85%   {transform: rotate(360deg); }

 100%   {transform: rotate(360deg); }
}
.pGameUserOperation:hover{
  opacity:1;
}

.pGameUserOperation{
 opacity:0.8;
}

.stripy1 {
  left:-100%;
  animation: stripy1 180s;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  animation-delay: 90s;
}

.stripy2 {
  left:-100%;
  animation: stripy2 180s;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes stripy1 {
  0% {
    left:-100%;
  }

  100% {
    left:100%;
  }
}
@keyframes stripy2 {
  0% {
    left:-100%;
  }

  100% {
    left:100%;
  }
}
</style>

