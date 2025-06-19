<template>
  <n-flex vertical :size="1">
    <ToolHeader
      title="Date-time converter"
      description="Convert date and time into the various different formats" />
    <div class="tool-content">
      <n-grid x-gap="12" :cols="1">
        <n-gi>
          <n-flex justify="center"
            ><n-card :bordered="false" embedded>
              <n-form ref="formRef" :rules="rules">
                <n-form-item path="inputDate">
                  <n-input
                    v-model:value="inputDate"
                    autofocus
                    clearable
                    placeholder="Put your date string here..."
                    :spellcheck="false"
                    @update:value="onDateInputChanged"
                    :style="{ width: '70%' }" />
                  <n-select
                    v-model:value="formatIndex"
                    style="margin-left: 10px; width: 30%"
                    :options="
                      formats.map(({ name }, i) => ({ label: name, value: i }))
                    " />
                </n-form-item>
              </n-form>
              <n-flex vertical>
                <n-form
                  label-placement="left"
                  label-width="auto"
                  require-mark-placement="right-hanging">
                  <n-form-item
                    :label="name"
                    v-for="{ name, fromDate } in formats"
                    :key="name">
                    <n-input-group>
                      <n-input
                        :value="
                          formatDateUsingFormatter(fromDate, normalizedDate)
                        "
                        placeholder="Invalid date..."
                        readonly>
                        <template #suffix>
                          <n-popover trigger="hover" :show-arrow="false">
                            <template #trigger>
                              <n-button
                                type="primary"
                                text
                                circle
                                @click="
                                  copy(
                                    formatDateUsingFormatter(
                                      fromDate,
                                      normalizedDate
                                    ),
                                    name
                                  )
                                ">
                                <template #icon> <CopyIcon /> </template>
                              </n-button>
                            </template>
                            <span>{{ mm[name] }}</span>
                          </n-popover>
                        </template>
                      </n-input>
                    </n-input-group>
                  </n-form-item>
                </n-form>
              </n-flex>
            </n-card>
          </n-flex>
        </n-gi>
      </n-grid>
    </div>
  </n-flex>
</template>
<script lang="ts" setup>
import {
  NFlex,
  NGrid,
  NGi,
  NCard,
  NFormItem,
  NInput,
  NSelect,
  NInputGroup,
  NButton,
  NPopover,
  NForm,
  type FormInst,
} from "naive-ui";
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  isDate,
  isValid,
  parseISO,
  parseJSON,
} from "date-fns";
import {
  dateToExcelFormat,
  excelFormatToDate,
  isExcelFormat,
  isISO8601DateTimeString,
  isISO9075DateString,
  isMongoObjectId,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestampReg,
  isUTCDateString,
  isUnixTimestamp,
} from "@/utils/date-time-converter.models";
import { withDefaultOnError } from "@/utils/defaults";
import { useNow } from "@vueuse/core";

type ToDateMapper = (value: string) => Date;

export interface DateFormat {
  name: string;
  fromDate: (date: Date) => string;
  toDate: (value: string) => Date;
  formatMatcher: (dateString: string) => boolean;
}
const formRef = ref<FormInst | null>(null);
const inputDate = ref("");

const toDate: ToDateMapper = (date) => new Date(date);

import ToolHeader from "../components/ToolHeader.vue";
import { useStore } from "../store";
import CopyIcon from "../icon/Copy.vue";
const store = useStore();
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();

const formats: DateFormat[] = [
  {
    name: "JS locale date string",
    fromDate: (date) => date.toString(),
    toDate,
    formatMatcher: () => false,
  },
  {
    name: "ISO 8601",
    fromDate: formatISO,
    toDate: parseISO,
    formatMatcher: (date) => isISO8601DateTimeString(date),
  },
  {
    name: "ISO 9075",
    fromDate: formatISO9075,
    toDate: parseISO,
    formatMatcher: (date) => isISO9075DateString(date),
  },
  {
    name: "RFC 3339",
    fromDate: formatRFC3339,
    toDate,
    formatMatcher: (date) => isRFC3339DateString(date),
  },
  {
    name: "RFC 7231",
    fromDate: formatRFC7231,
    toDate,
    formatMatcher: (date) => isRFC7231DateString(date),
  },
  {
    name: "Unix timestamp",
    fromDate: (date) => String(getUnixTime(date)),
    toDate: (sec) => fromUnixTime(+sec),
    formatMatcher: (date) => isUnixTimestamp(date),
  },
  {
    name: "Timestamp",
    fromDate: (date) => String(getTime(date)),
    toDate: (ms) => parseJSON(+ms as any),
    formatMatcher: (date) => isTimestampReg(date),
  },
  {
    name: "UTC format",
    fromDate: (date) => date.toUTCString(),
    toDate,
    formatMatcher: (date) => isUTCDateString(date),
  },
  {
    name: "Mongo ObjectID",
    fromDate: (date) =>
      `${Math.floor(date.getTime() / 1000).toString(16)}0000000000000000`,
    toDate: (objectId) =>
      new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1000),
    formatMatcher: (date) => isMongoObjectId(date),
  },
  {
    name: "Excel date/time",
    fromDate: (date) => dateToExcelFormat(date),
    toDate: excelFormatToDate,
    formatMatcher: isExcelFormat,
  },
];
const mm = ref<Record<string, string>>(
  formats.reduce(
    (acc, v) => {
      acc[v.name] = "Copy to clipboard";
      return acc;
    },
    {} as Record<string, string>
  )
);
const formatIndex = ref(6);
const now = useNow();

const normalizedDate = computed(() => {
  if (!inputDate.value) {
    return now.value;
  }

  const { toDate } = formats[formatIndex.value];

  try {
    return toDate(inputDate.value);
  } catch (_ignored) {
    return undefined;
  }
});

function onDateInputChanged(value: string) {
  const matchingIndex = formats.findIndex(({ formatMatcher }) =>
    formatMatcher(value)
  );
  if (matchingIndex !== -1) {
    formatIndex.value = matchingIndex;
  }
}

function formatDateUsingFormatter(
  formatter: (date: Date) => string,
  date?: Date
) {
  if (!date) {
    return "";
  }
  return withDefaultOnError(() => formatter(date), "");
}

const copy = (copyText: any, name: string) => {
  try {
    toClipboard(copyText);
    mm.value[name] = "Copied!";
    const message = "Copy to clipboard";
    setTimeout(
      (msg: string) => {
        mm.value[name] = msg;
      },
      1000,
      message
    );
  } catch (e) {}
};
const rules = {
  inputDate: {
    validator() {
      if (!inputDate.value) {
        return true;
      }
      try {
        const maybeDate = formats[formatIndex.value].toDate(inputDate.value);
        if (isDate(maybeDate) && isValid(maybeDate)) {
          return true;
        }
      } catch (e: any) {}
      return new Error("This date is invalid for this format");
    },
    trigger: ["blur", "input"],
  },
};
</script>
<style scoped></style>
