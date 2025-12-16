#!/bin/bash

# Dependabot PRs管理スクリプト
# このスクリプトは既存のDependabot PRを管理するためのヘルパーツールです

set -e

# 色付き出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Dependabot PR Management Tool ===${NC}\n"

# GitHub CLIがインストールされているか確認
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# 現在のオープンなDependabot PRを取得
echo -e "${YELLOW}Fetching open Dependabot PRs...${NC}"
DEPENDABOT_PRS=$(gh pr list --author app/dependabot --json number,title,labels --jq '.[] | "\(.number):\(.title)"')

if [ -z "$DEPENDABOT_PRS" ]; then
    echo -e "${GREEN}No open Dependabot PRs found!${NC}"
    exit 0
fi

echo -e "\n${YELLOW}Open Dependabot PRs:${NC}"
echo "$DEPENDABOT_PRS"

# ユーザーに選択肢を提示
echo -e "\n${YELLOW}What would you like to do?${NC}"
echo "1) Close all Dependabot PRs (recommended with new grouping strategy)"
echo "2) List PRs with security labels"
echo "3) Close specific PRs"
echo "4) Show PR details"
echo "5) Exit"
echo -n "Enter your choice [1-5]: "
read -r choice

case $choice in
    1)
        echo -e "\n${YELLOW}Closing all Dependabot PRs...${NC}"
        COMMENT="新しいDependabot設定により、このPRをクローズします。次回の月次更新で、全ての依存関係が統合されたPRが作成されます。詳細: .github/DEPENDABOT_MANAGEMENT.md"
        
        while IFS=: read -r pr_number pr_title; do
            echo -e "Closing PR #${pr_number}: ${pr_title}"
            gh pr close "$pr_number" --comment "$COMMENT" || echo -e "${RED}Failed to close PR #${pr_number}${NC}"
        done <<< "$DEPENDABOT_PRS"
        
        echo -e "\n${GREEN}All Dependabot PRs have been closed.${NC}"
        ;;
    
    2)
        echo -e "\n${YELLOW}PRs with security labels:${NC}"
        gh pr list --author app/dependabot --label security --json number,title,labels
        ;;
    
    3)
        echo -n "Enter PR numbers to close (space-separated): "
        read -r pr_numbers
        
        COMMENT="このPRをクローズします。次回の月次更新で統合されたPRに含まれます。"
        
        for pr_number in $pr_numbers; do
            echo -e "Closing PR #${pr_number}"
            gh pr close "$pr_number" --comment "$COMMENT" || echo -e "${RED}Failed to close PR #${pr_number}${NC}"
        done
        
        echo -e "\n${GREEN}Selected PRs have been closed.${NC}"
        ;;
    
    4)
        echo -n "Enter PR number to view: "
        read -r pr_number
        gh pr view "$pr_number"
        ;;
    
    5)
        echo -e "${GREEN}Exiting...${NC}"
        exit 0
        ;;
    
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done!${NC}"
echo -e "${YELLOW}Next Dependabot update: First Monday of next month${NC}"
echo -e "${YELLOW}For more information, see: .github/DEPENDABOT_MANAGEMENT.md${NC}"
