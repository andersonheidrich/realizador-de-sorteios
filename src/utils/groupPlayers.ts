export const groupPlayers = <T>(items: T[], numGroups: number): T[][] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  const groups: T[][] = Array.from({ length: numGroups }, () => []);

  shuffled.forEach((item, index) => {
    groups[index % numGroups].push(item);
  });

  return groups;
};
