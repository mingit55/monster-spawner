# Monster Spawner

### 개요

RPG 리듬게임 '루바토 헌터'의 노드 생성기입니다.

밸런스를 담당하는 팀원이 좀 더 간편하게 노드를 생성할 수 있도록 HTML/CSS/Javascript로 노드 생성기를 제작해 보았습니다.

### 사용 방법

1. 스테이지 음악으로 사용할 음악 파일을 업로드 합니다.
2. 노드를 생성할 파트를 재생시킵니다. ( 재생/일시정지, 음량 조절, Seek bar 제공 )
3. 방향키를 통해 해당 방향의 몬스터를 생성할 수 있습니다.
4. 직접 몬스터의 이동 속도를 조절할 수 있습니다. (단축키 1~9)
5. 생성된 몬스터는 해당 재생 시간에 등록되어 저장된 시간에 입력한 속도로 출현합니다.
6. 우측에는 몬스터 목록이 보이며 지금까지 등록된 몬스터가 시간 순으로 나열됩니다.
7. 몬스터를 클릭하면 해당 시간대로 이동할 수 있습니다.
8. 출현 시간, 앞 몬스터와의 딜레이, 속도 등의 정보가 보이고, x 아이콘을 통해 삭제할 수 있습니다.
9. 현재 출현 중인 몬스터는 노랑색 테두리로 강조되어 보입니다.
10. 루바토 헌터 내의 플레이어 공격 딜레이 (0.1s) 안에 공격할 수 없는 몬스터일 경우 붉은색 테두리로 강조되어 보입니다. (이후 XML 내보내기 시, 경고창을 내보냅니다.)
11. XML 업로드 / 내보내기 버튼으로 기존의 파일을 불러오거나 현재 몬스터 정보를 XML 문자열로 복사할 수 있습니다. 
12. 내려 받은 XML은 개발 파트에 연락하면 바로 적용해 줍니다. ^-'

※ XML 내보내기 예시

```xml
<?xml version=""1.0"" encoding=""UTF-8"" standalone=""yes""?><ROOT><pattern direction=""2"" speed=""5"" delay=""1.32"" /><pattern direction=""4"" speed=""5"" delay=""0.092"" /><pattern direction=""8"" speed=""5"" delay=""0.833"" /><pattern direction=""6"" speed=""5"" delay=""0.479"" /><pattern direction=""2"" speed=""5"" delay=""0.678"" /><pattern direction=""4"" speed=""5"" delay=""0.686"" /><pattern direction=""8"" speed=""5"" delay=""0.639"" /><pattern direction=""6"" speed=""3"" delay=""0.771"" /><pattern direction=""2"" speed=""3"" delay=""0.476"" /><pattern direction=""4"" speed=""3"" delay=""0.536"" /><pattern direction=""8"" speed=""5"" delay=""0.738"" /><pattern direction=""6"" speed=""6"" delay=""0.535"" /><pattern direction=""4"" speed=""6"" delay=""0.445"" /><pattern direction=""8"" speed=""1"" delay=""0.528"" /><pattern direction=""6"" speed=""2"" delay=""0.552"" /><pattern direction=""2"" speed=""2"" delay=""0.327"" /><pattern direction=""4"" speed=""2"" delay=""0.511"" /><pattern direction=""8"" speed=""1"" delay=""1.024"" /><pattern direction=""6"" speed=""1"" delay=""0.49"" /><pattern direction=""8"" speed=""8"" delay=""1.843"" /><pattern direction=""4"" speed=""8"" delay=""0.613"" /><pattern direction=""6"" speed=""9"" delay=""0.558"" /><pattern direction=""2"" speed=""9"" delay=""0.219"" /><pattern direction=""8"" speed=""9"" delay=""0.399"" /><pattern direction=""4"" speed=""9"" delay=""0.194"" /><pattern direction=""6"" speed=""9"" delay=""0.363"" /><pattern direction=""2"" speed=""9"" delay=""0.353"" /><pattern direction=""4"" speed=""9"" delay=""0.401"" /><pattern direction=""8"" speed=""9"" delay=""0.092"" /><pattern direction=""6"" speed=""9"" delay=""0.159"" /><pattern direction=""2"" speed=""9"" delay=""0.134"" /><pattern direction=""4"" speed=""9"" delay=""0.069"" /><pattern direction=""8"" speed=""9"" delay=""0.109"" /><pattern direction=""6"" speed=""9"" delay=""0.03"" /><pattern direction=""2"" speed=""9"" delay=""0.159"" /><pattern direction=""4"" speed=""9"" delay=""0.042"" /><pattern direction=""8"" speed=""9"" delay=""0.119"" /><pattern direction=""6"" speed=""9"" delay=""0.045"" /><pattern direction=""2"" speed=""9"" delay=""0.147"" /><pattern direction=""4"" speed=""9"" delay=""0.043"" /><pattern direction=""8"" speed=""9"" delay=""0.132"" /><pattern direction=""6"" speed=""9"" delay=""0.033"" /></ROOT>
```

### 자료 이미지

1. 전시회 자료 - 루바토 헌터

    ![Monster%20Spawner%205dabfd47888e4a0481cbc3c42c9dbe38/-.jpg](Monster%20Spawner%205dabfd47888e4a0481cbc3c42c9dbe38/-.jpg)

2. 몬스터 스포너 화면

![Monster%20Spawner%205dabfd47888e4a0481cbc3c42c9dbe38.png](Monster%20Spawner%205dabfd47888e4a0481cbc3c42c9dbe38.png)