// Game data
let gameData = {
  playerName: "",
  currentAvatar: 0,
  wins: 0,
  losses: 0,
  currentBattle: null,
};

// Avatars - реальні зображення персонажів
const avatars = [
  "https://img.icons8.com/color/96/person-male.png", // Default
  "https://img.icons8.com/color/96/shield.png", // Warrior
  "https://img.icons8.com/color/96/knight.png", // Knight
  "https://img.icons8.com/color/96/ninja-head.png", // Ninja
  "https://img.icons8.com/color/96/viking-helmet.png", // Viking
  "https://img.icons8.com/color/96/archery.png", // Archer
];

// Enemies - реальні зображення ворогів
const enemies = [
  {
    name: "Mutant Spider",
    avatar: "https://img.icons8.com/color/96/spider.png", // павук
    health: 120,
    damage: 25,
    critChance: 0.15,
    critMultiplier: 1.5,
    attackZones: 2,
    defenseZones: 1,
    description: "Fast enemy, attacks 2 zones, blocks 1",
  },
  {
    name: "Mountain Spider 3000",
    avatar: "https://img.icons8.com/color/96/spider.png", // Реальний тролль
    health: 180,
    damage: 35,
    critChance: 0.1,
    critMultiplier: 2.0,
    attackZones: 1,
    defenseZones: 3,
    description: "Slow but strong. Attacks 1 zone, blocks all 3",
  },
  {
    name: "Battle Robot",
    avatar: "https://img.icons8.com/color/96/robot-2.png", // Реальний робот
    health: 150,
    damage: 30,
    critChance: 0.2,
    critMultiplier: 1.8,
    attackZones: 1,
    defenseZones: 2,
    description: "Balanced enemy. Attacks 1 zone, blocks 2",
  },
];

// Player
const player = {
  health: 100,
  maxHealth: 100,
  damage: 30,
  critChance: 0.15,
  critMultiplier: 1.5,
};

// Battle state
let battleState = {
  selectedAttack: null,
  selectedDefense: [],
  enemy: null,
  playerHealth: 100,
  enemyHealth: 100,
};

// Initialization
window.onload = function () {
  loadGameData();
  setupAvatars();
  updateUI();
};

// Save and load data (localStorage not used, memory only)
function saveGameData() {
  // In real project this would be localStorage
  console.log("Data saved to memory");
}

function loadGameData() {
  // In real project this would load from localStorage
  console.log("Data loaded from memory");
}

// Setup avatars
function setupAvatars() {
  const avatarSelector = document.getElementById("avatarSelector");
  avatarSelector.innerHTML = "";

  avatars.forEach((avatar, index) => {
    const img = document.createElement("img");
    img.src = avatar;
    img.className = "avatar";
    img.onclick = () => selectAvatar(index);
    avatarSelector.appendChild(img);
  });
}

// Register player
function registerPlayer() {
  const nameInput = document.getElementById("playerNameInput");
  const name = nameInput.value.trim();

  if (name === "") {
    alert("Please enter your name!");
    return;
  }

  gameData.playerName = name;
  updateUI();
  showScreen("home");
  saveGameData();
}

// Change name
function changeName() {
  const newNameInput = document.getElementById("newNameInput");
  const newName = newNameInput.value.trim();

  if (newName === "") {
    alert("Please enter a new name!");
    return;
  }

  gameData.playerName = newName;
  updateUI();
  newNameInput.value = "";
  alert("Name changed successfully!");
  saveGameData();
}

// Select avatar
function selectAvatar(index) {
  gameData.currentAvatar = index;
  updateUI();
  saveGameData();
}

// Update UI
function updateUI() {
  // Update name
  document.getElementById(
    "welcomeText"
  ).textContent = `Welcome, ${gameData.playerName}!`;
  document.getElementById("characterName").textContent = gameData.playerName;
  document.getElementById("playerBattleName").textContent = gameData.playerName;

  // Update avatar
  const currentAvatar = avatars[gameData.currentAvatar];
  document.getElementById("currentAvatar").src = currentAvatar;
  document.getElementById("playerBattleAvatar").src = currentAvatar;

  // Update stats
  document.getElementById("winsCount").textContent = gameData.wins;
  document.getElementById("lossesCount").textContent = gameData.losses;

  // Highlight selected avatar
  const avatarElements = document.querySelectorAll("#avatarSelector .avatar");
  avatarElements.forEach((avatar, index) => {
    avatar.classList.toggle("selected", index === gameData.currentAvatar);
  });
}

// Show screen
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

// Start battle
function startBattle() {
  // Select random enemy
  const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
  battleState.enemy = { ...randomEnemy };
  battleState.playerHealth = player.maxHealth;
  battleState.enemyHealth = battleState.enemy.health;
  battleState.selectedAttack = null;
  battleState.selectedDefense = [];

  // Update battle UI
  document.getElementById("enemyName").textContent = battleState.enemy.name;
  document.getElementById("enemyAvatar").src = battleState.enemy.avatar;
  document.getElementById("enemyDescription").textContent =
    battleState.enemy.description;

  updateHealthBars();
  clearCombatLog();
  addLogEntry(
    "🔥 Battle started! Select attack and defense zones.",
    "log-entry"
  );

  // Reset zone selection
  document.querySelectorAll(".zone").forEach((zone) => {
    zone.classList.remove("attack-selected", "defense-selected");
  });

  updateSelectionDisplay();
  showScreen("battle");
}

// Select zone
function selectZone(zone) {
  const zoneElement = document.querySelector(`[data-zone="${zone}"]`);

  if (zoneElement.classList.contains("attack-selected")) {
    // Remove attack selection
    battleState.selectedAttack = null;
    zoneElement.classList.remove("attack-selected");
  } else if (zoneElement.classList.contains("defense-selected")) {
    // Remove defense selection
    const index = battleState.selectedDefense.indexOf(zone);
    if (index > -1) {
      battleState.selectedDefense.splice(index, 1);
    }
    zoneElement.classList.remove("defense-selected");
  } else {
    // New selection
    if (battleState.selectedAttack === null) {
      // Select for attack
      battleState.selectedAttack = zone;
      zoneElement.classList.add("attack-selected");
    } else if (battleState.selectedDefense.length < 2) {
      // Select for defense
      battleState.selectedDefense.push(zone);
      zoneElement.classList.add("defense-selected");
    }
  }

  updateSelectionDisplay();
}

// Update selection display
function updateSelectionDisplay() {
  document.getElementById("attackSelection").textContent =
    battleState.selectedAttack || "not selected";
  document.getElementById("defenseSelection").textContent =
    battleState.selectedDefense.length > 0
      ? battleState.selectedDefense.join(", ")
      : "not selected";

  // Enable attack button
  const canAttack =
    battleState.selectedAttack !== null &&
    battleState.selectedDefense.length === 2;
  document.getElementById("attackBtn").disabled = !canAttack;
}

// Perform round
function performRound() {
  if (!battleState.selectedAttack || battleState.selectedDefense.length !== 2) {
    return;
  }

  // Enemy actions
  const enemyAttack = generateEnemyAction("attack");
  const enemyDefense = generateEnemyAction("defense");

  // Calculate player damage
  let playerDamage = 0;
  let playerCrit = Math.random() < player.critChance;

  if (!enemyDefense.includes(battleState.selectedAttack) || playerCrit) {
    playerDamage = player.damage;
    if (playerCrit) {
      playerDamage *= player.critMultiplier;
    }
  }

  // Calculate enemy damage
  let enemyDamageTotal = 0;
  let enemyCrits = [];

  enemyAttack.forEach((attackZone) => {
    let damage = 0;
    let crit = Math.random() < battleState.enemy.critChance;

    if (!battleState.selectedDefense.includes(attackZone) || crit) {
      damage = battleState.enemy.damage;
      if (crit) {
        damage *= battleState.enemy.critMultiplier;
        enemyCrits.push(attackZone);
      }
    }
    enemyDamageTotal += damage;
  });

  // Apply damage
  battleState.enemyHealth = Math.max(0, battleState.enemyHealth - playerDamage);
  battleState.playerHealth = Math.max(
    0,
    battleState.playerHealth - enemyDamageTotal
  );

  // Log results
  logRoundResults(
    enemyAttack,
    enemyDefense,
    playerDamage,
    enemyDamageTotal,
    playerCrit,
    enemyCrits
  );

  updateHealthBars();

  // Check battle end
  if (battleState.playerHealth <= 0 || battleState.enemyHealth <= 0) {
    endBattle();
    return;
  }

  // Reset selection for next round
  battleState.selectedAttack = null;
  battleState.selectedDefense = [];
  document.querySelectorAll(".zone").forEach((zone) => {
    zone.classList.remove("attack-selected", "defense-selected");
  });
  updateSelectionDisplay();
}

// Generate enemy action
function generateEnemyAction(type) {
  const zones = ["head", "body", "legs"];
  const count =
    type === "attack"
      ? battleState.enemy.attackZones
      : battleState.enemy.defenseZones;
  const result = [];

  while (result.length < count) {
    const zone = zones[Math.floor(Math.random() * zones.length)];
    if (!result.includes(zone)) {
      result.push(zone);
    }
  }

  return result;
}

// Log round results
function logRoundResults(
  enemyAttack,
  enemyDefense,
  playerDamage,
  enemyDamageTotal,
  playerCrit,
  enemyCrits
) {
  // Player attack
  if (playerDamage > 0) {
    const critText = playerCrit ? " (CRITICAL HIT!)" : "";
    const logClass = playerCrit ? "log-crit" : "log-player";
    addLogEntry(
      `${gameData.playerName} attacked ${
        battleState.enemy.name
      } in the ${getZoneName(
        battleState.selectedAttack
      )} and dealt ${playerDamage} damage${critText}`,
      logClass
    );
  } else {
    addLogEntry(
      `${gameData.playerName} attacked ${
        battleState.enemy.name
      } in the ${getZoneName(
        battleState.selectedAttack
      )}, but the attack was blocked!`,
      "log-player"
    );
  }

  // Enemy attacks
  enemyAttack.forEach((attackZone) => {
    const blocked = battleState.selectedDefense.includes(attackZone);
    const crit = enemyCrits.includes(attackZone);
    const damage =
      blocked && !crit
        ? 0
        : battleState.enemy.damage *
          (crit ? battleState.enemy.critMultiplier : 1);

    if (damage > 0) {
      const critText = crit ? " (CRITICAL HIT!)" : "";
      const logClass = crit ? "log-crit" : "log-enemy";
      addLogEntry(
        `${battleState.enemy.name} attacked ${
          gameData.playerName
        } in the ${getZoneName(
          attackZone
        )} and dealt ${damage} damage${critText}`,
        logClass
      );
    } else {
      addLogEntry(
        `${battleState.enemy.name} attacked ${
          gameData.playerName
        } in the ${getZoneName(attackZone)}, but the attack was blocked!`,
        "log-enemy"
      );
    }
  });
}

// Get zone name
function getZoneName(zone) {
  const names = {
    head: "head",
    body: "body",
    legs: "legs",
  };
  return names[zone] || zone;
}

// Add log entry
function addLogEntry(text, className) {
  const logElement = document.getElementById("combatLog");
  const entry = document.createElement("div");
  entry.className = `log-entry ${className}`;
  entry.textContent = text;
  logElement.appendChild(entry);
  logElement.scrollTop = logElement.scrollHeight;
}

// Clear combat log
function clearCombatLog() {
  document.getElementById("combatLog").innerHTML = "";
}

// Update health bars
function updateHealthBars() {
  const playerHealthPercent =
    (battleState.playerHealth / player.maxHealth) * 100;
  const enemyHealthPercent =
    (battleState.enemyHealth / battleState.enemy.health) * 100;

  document.getElementById("playerHealthFill").style.width =
    playerHealthPercent + "%";
  document.getElementById(
    "playerHealthText"
  ).textContent = `${battleState.playerHealth}/${player.maxHealth}`;

  document.getElementById("enemyHealthFill").style.width =
    enemyHealthPercent + "%";
  document.getElementById(
    "enemyHealthText"
  ).textContent = `${battleState.enemyHealth}/${battleState.enemy.health}`;
}

// End battle
function endBattle() {
  const playerWon = battleState.enemyHealth <= 0;

  if (playerWon) {
    gameData.wins++;
    addLogEntry(`🎉 ${gameData.playerName} won! Congratulations!`, "log-crit");
  } else {
    gameData.losses++;
    addLogEntry(`💀 ${gameData.playerName} was defeated...`, "log-crit");
  }

  updateUI();
  saveGameData();

  // Disable attack button
  document.getElementById("attackBtn").disabled = true;

  setTimeout(() => {
    if (playerWon) {
      alert("Congratulations on your victory! 🎉");
    } else {
      alert("You lost... Try again! 💀");
    }
  }, 1000);
}

// Enter key handler for name inputs
document.addEventListener("DOMContentLoaded", function () {
  const playerNameInput = document.getElementById("playerNameInput");
  if (playerNameInput) {
    playerNameInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        registerPlayer();
      }
    });
  }

  const newNameInput = document.getElementById("newNameInput");
  if (newNameInput) {
    newNameInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        changeName();
      }
    });
  }
});
