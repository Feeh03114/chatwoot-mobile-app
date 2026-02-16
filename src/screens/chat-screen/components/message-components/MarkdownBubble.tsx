import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { openURL } from '@/utils/urlUtils';

import { tailwind } from '@/theme';
import { MESSAGE_VARIANTS } from '@/constants';

type MarkdownBubbleProps = {
  messageContent: string;
  variant: string;
};

export const MarkdownBubble = (props: MarkdownBubbleProps) => {
  const { messageContent, variant } = props;
  const colorScheme = useColorScheme();

  const handleURL = (url: string) => {
    openURL({ URL: url });
    return true;
  };

  const variantColorClassMap = {
    [MESSAGE_VARIANTS.AGENT]: { light: 'text-gray-950', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.USER]: { light: 'text-gray-50', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.BOT]: { light: 'text-gray-950', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.TEMPLATE]: { light: 'text-gray-950', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.ERROR]: { light: 'text-gray-50', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.PRIVATE]: { light: 'text-amber-950', dark: 'text-amberDark-900' },
  };

  const currentTextColor =
    colorScheme === 'dark'
      ? tailwind.color(variantColorClassMap[variant].dark)
      : tailwind.color(variantColorClassMap[variant].light);

  const styles = StyleSheet.create({
    text: {
      fontSize: 16,
      letterSpacing: 0.32,
      lineHeight: 22,
      color: currentTextColor,
    },
    strong: {
      fontFamily: 'Inter-600-20',
      fontWeight: '600',
    },
    em: {
      fontStyle: 'italic',
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 0,
      fontFamily: 'Inter-400-20',
    },
    bullet_list: {
      minWidth: 200,
    },
    ordered_list: {
      minWidth: 200,
    },
    list_item: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    bullet_list_icon: {
      marginLeft: 0,
      marginRight: 8,
      fontWeight: '900',
    },
    ordered_list_icon: {
      marginLeft: 0,
      marginRight: 8,
      fontWeight: '900',
    },
  });
  return (
    <Markdown
      mergeStyle
      markdownit={MarkdownIt({
        linkify: true,
        typographer: true,
      })}
      onLinkPress={handleURL}
      style={styles}>
      {messageContent}
    </Markdown>
  );
};
