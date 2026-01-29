import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { openURL } from '@/utils/urlUtils';

import { tailwind } from '@/theme';
import { MESSAGE_VARIANTS } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors'; // Adicionar import

type MarkdownBubbleProps = {
  messageContent: string;
  variant: string;
};

export const MarkdownBubble = (props: MarkdownBubbleProps) => {
  const { messageContent, variant } = props;
  const { getThemedColor } = useThemeColors(); // Adicionar useThemeColors

  const handleURL = (url: string) => {
    openURL({ URL: url });
    return true;
  };

  // Mapear variantes para as classes de cor Tailwind, para depois usar getThemedColor
  const variantColorClassMap = {
    [MESSAGE_VARIANTS.AGENT]: { light: 'text-gray-950', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.USER]: { light: 'text-white', dark: 'text-whiteA-A9' }, // 'text-white' é um alias, whiteA-A9 é mais explícito para dark
    [MESSAGE_VARIANTS.BOT]: { light: 'text-gray-950', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.TEMPLATE]: { light: 'text-gray-950', dark: 'text-grayDark-950' },
    [MESSAGE_VARIANTS.ERROR]: { light: 'text-white', dark: 'text-whiteA-A9' },
    [MESSAGE_VARIANTS.PRIVATE]: { light: 'text-amber-950', dark: 'text-amberDark-950' },
  };

  const currentTextColor = getThemedColor(
    variantColorClassMap[variant].light,
    variantColorClassMap[variant].dark,
  );

  const styles = StyleSheet.create({
    text: {
      fontSize: 16,
      letterSpacing: 0.32,
      lineHeight: 22,
      color: currentTextColor, // Aplicar a cor diretamente
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
      // color: currentTextColor, // Aplicar se os list_items também devem ter a cor da bolha
    },
    bullet_list_icon: {
      marginLeft: 0,
      marginRight: 8,
      fontWeight: '900',
      // color: currentTextColor, // Aplicar se os ícones da lista também devem ter a cor da bolha
    },
    ordered_list_icon: {
      marginLeft: 0,
      marginRight: 8,
      fontWeight: '900',
      // color: currentTextColor, // Aplicar se os ícones da lista também devem ter a cor da bolha
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
