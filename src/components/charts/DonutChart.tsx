import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface DonutChartProps {
  data: { name: string; value: number }[]
  centerText?: string
  centerSubtext?: string
  height?: number | string
  colors?: string[]
  /** 环形图中心点；不传则按图例位置自动计算 */
  pieCenter?: [string, string]
  /** 图例位置：底部可避免与中心文字、色块重叠（双列场景推荐） */
  legendPlacement?: 'bottom' | 'right'
}

function centerFontSize(text: string) {
  const len = text.replace(/[^\d.万亿%]/g, '').length || text.length
  if (len >= 7) return 15
  if (len >= 5) return 18
  if (len >= 4) return 20
  return 24
}

export default function DonutChart({
  data,
  centerText,
  centerSubtext,
  height = 160,
  colors = ['#00d4ff', '#0078ff', '#00e676', '#ffab00', '#ff5252'],
  pieCenter,
  legendPlacement = 'bottom',
}: DonutChartProps) {
  const hasCenter = Boolean(centerText)
  const hasSub = Boolean(centerSubtext)
  const numSize = centerText ? centerFontSize(centerText) : 24
  const resolvedCenter: [string, string] =
    pieCenter ?? (legendPlacement === 'right' ? ['32%', '50%'] : ['50%', '42%'])

  const centerLabel = hasCenter
    ? {
        show: true,
        position: 'center' as const,
        formatter: () =>
          hasSub ? `{num|${centerText}}\n{sub|${centerSubtext}}` : `{num|${centerText}}`,
        rich: {
          num: {
            fill: '#00d4ff',
            fontSize: numSize,
            fontWeight: 'bold' as const,
            lineHeight: numSize + 6,
            align: 'center' as const,
          },
          sub: {
            fill: 'rgba(232,244,255,0.9)',
            fontSize: 14,
            lineHeight: 20,
            align: 'center' as const,
            padding: [2, 0, 0, 0] as [number, number, number, number],
          },
        },
      }
    : { show: false }

  const option: EChartsOption = {
    color: colors,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(4, 22, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e8f4ff', fontSize: 16 },
      confine: true,
      extraCssText: 'max-width: 320px; white-space: normal;',
    },
    legend:
      legendPlacement === 'right'
        ? {
            orient: 'vertical',
            right: 4,
            top: 'center',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 12,
            textStyle: {
              color: 'rgba(232,244,255,0.9)',
              fontSize: 14,
              lineHeight: 20,
              width: 150,
              overflow: 'break',
            },
          }
        : {
            orient: 'horizontal',
            left: 'center',
            bottom: 0,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 10,
            textStyle: {
              color: 'rgba(232,244,255,0.9)',
              fontSize: 14,
              lineHeight: 18,
            },
            type: data.length > 4 ? 'scroll' : 'plain',
            pageIconColor: '#00d4ff',
            pageIconInactiveColor: 'rgba(232,244,255,0.35)',
            pageTextStyle: { color: 'rgba(232,244,255,0.7)', fontSize: 14 },
          },
    series: [
      {
        type: 'pie',
        radius: legendPlacement === 'right' ? ['42%', '62%'] : ['38%', '58%'],
        center: resolvedCenter,
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        emphasis: {
          scale: false,
          label: { show: false },
        },
        // 仅首项挂中心文字，避免多扇区叠加成“乱码/图标”
        data: data.map((item, index) => ({
          ...item,
          label: index === 0 ? centerLabel : { show: false },
          emphasis: { label: { show: false } },
        })),
        itemStyle: {
          borderColor: '#020b1a',
          borderWidth: 2,
        },
      },
    ],
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
      notMerge
    />
  )
}
