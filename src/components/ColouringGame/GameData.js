

// 游戏数据
let gameData = {
  id: 1, // 游戏id
  name: '填色游戏',
  description: '简单填色游戏',
  config: {
    // 游戏配置
    gameConfig: {
      // 游戏类型
      // gameType: 'colouring',
      // 游戏模式
      // gameMode: 'single',
      // 游戏难度
      // gameDifficulty: 'normal',
      // 游戏时间
      // gameTime: 10,
      // 游戏颜色
      gameColors: {
        selectedBorderColor: '#0000ff'
      }
    }
  },
  palette: {
    // 颜料盘
    colors: [
      '#FFFAEE',
      '#FFEFD4',
      '#9895C1',
      '#FCAE7A'
    ],
  },
  comics: [
    {
      id: 1,
      name: '大汽车',
      description: '大汽车描述',
      exampleImg: '/assets/exp/A.png',
      backplace: {
        id: 0,
        imageUrl: require('@/assets/ITEMimg/i1/ITEM.jpg'),
        style: {
          x: 0,
          y: 0,
          w: 500,
          h: 500
        },
        zIndex: 1,
        parts: [
          {
            id: 1,
            name: '车架',
            description: '骑车车架',
            imageUrl: require('@/assets/ITEMimg/i1/1.png'),
            style: {
              x:10,
              y:39,
              w:488,
              h:365
            },
            zIndex: 1
          },
          {
            id: 2,
            name: '前车窗',
            description: '前车窗',
            imageUrl: require('@/assets/ITEMimg/i1/2.png'),
            style: {
              x:113,
              y:87,
              w:187,
              h:140
            },
            zIndex: 2
          },
          {
            id: 3,
            name: '侧车窗',
            description: '侧车窗',
            imageUrl: require('@/assets/ITEMimg/i1/3.png'),
            style: {
              x:309,
              y:90,
              w:130,
              h:129
            },
            zIndex: 2
          },
          {
            id: 4,
            name: '前右车灯',
            description: '前右车灯',
            imageUrl: require('@/assets/ITEMimg/i1/4.png'),
            style: {
              x:23,
              y:255,
              w:56,
              h:75
            },
            zIndex: 2
          },
          {
            id: 5,
            name: '前左车灯',
            description: '前左车灯',
            imageUrl: require('@/assets/ITEMimg/i1/5.png'),
            style: {
              x:197,
              y:265,
              w:55,
              h:75
            },
            zIndex: 2
          },
          {
            id: 6,
            name: '前车保险杠',
            description: '前车保险杠',
            imageUrl: require('@/assets/ITEMimg/i1/6.png'),
            style: {
              x:3,
              y:357,
              w:292,
              h:83
            },
            zIndex: 3
          },
          {
            id: 7,
            name: '轮胎',
            description: '轮胎',
            imageUrl: require('@/assets/ITEMimg/i1/7.png'),
            style: {
              x:86,
              y:292,
              w:392,
              h:170
            },
            zIndex: 2
          }
        ]
      }
    }
  ],
  // 填色游戏数据列表
  colouringGameDataList: [
    {
      id: 1,
      name: '大汽车',
      description: '大汽车描述',
      exampleImg: '/assets/exp/A.png',
      backplace: {
        id: 0,
        imageUrl: require('@/assets/ITEMimg/i1/ITEM.jpg'),
        style: {
          x: 0,
          y: 0,
          w: 500,
          h: 500
        }
      },
      parts: [
        {
          id: 1,
          name: '车架',
          description: '骑车车架',
          imageUrl: require('@/assets/ITEMimg/i1/1.png'),
          style: {
            x:10,
            y:39,
            w:488,
            h:365
          }
        },
        {
          id: 2,
          name: '前车窗',
          description: '前车窗',
          imageUrl: require('@/assets/ITEMimg/i1/2.png'),
          style: {
            x:113,
            y:87,
            w:187,
            h:140
          }
        },
        {
          id: 3,
          name: '侧车窗',
          description: '侧车窗',
          imageUrl: require('@/assets/ITEMimg/i1/3.png'),
          style: {
            x:309,
            y:90,
            w:130,
            h:129
          }
        },
        {
          id: 4,
          name: '前右车灯',
          description: '前右车灯',
          imageUrl: require('@/assets/ITEMimg/i1/4.png'),
          style: {
            x:23,
            y:255,
            w:56,
            h:75
          }
        },
        {
          id: 5,
          name: '前左车灯',
          description: '前左车灯',
          imageUrl: require('@/assets/ITEMimg/i1/5.png'),
          style: {
            x:197,
            y:265,
            w:55,
            h:75
          }
        },
        {
          id: 6,
          name: '前车保险杠',
          description: '前车保险杠',
          imageUrl: require('@/assets/ITEMimg/i1/6.png'),
          style: {
            x:3,
            y:357,
            w:292,
            h:83
          }
        },
        {
          id: 7,
          name: '轮胎',
          description: '轮胎',
          imageUrl: require('@/assets/ITEMimg/i1/7.png'),
          style: {
            x:86,
            y:292,
            w:392,
            h:170
          }
        },
      ]
    }
  ],
  
}

export default gameData