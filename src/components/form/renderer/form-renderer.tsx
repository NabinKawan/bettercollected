import React from 'react';

import styled from '@emotion/styled';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Button from '@app/components/ui/button';
import Loader from '@app/components/ui/loader';
import MarkdownText from '@app/components/ui/markdown-text';
import { StandardFormDto, StandardFormQuestionDto } from '@app/models/dtos/form';
import { IServerSideProps } from '@app/models/dtos/serverSideProps';

const StyledTextField = styled.div`
    .MuiInputBase-input {
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 8px;
    }

    .MuiSelect-select {
        padding-right: 32px;
        padding-left: 16px;
        padding-bottom: 16px;
    }

    textarea {
        padding-left: 0;
        padding-right: 0;
        padding-bottom: 8px;
        width: 100%;
        border-bottom-style: dotted;
    }

    textarea:disabled {
        color: rgba(0, 0, 0, 0.38);
    }
`;

interface ISubmission extends IServerSideProps {
    form: StandardFormDto;
}

enum QUESTION_TYPE {
    INPUT_FIELD = 'INPUT_FIELD',
    TEXT_AREA = 'TEXT_AREA',
    VIDEO_CONTENT = 'VIDEO_CONTENT',
    IMAGE_CONTENT = 'IMAGE_CONTENT',
    GROUP_RADIO_QUESTION = 'GROUP_RADIO_QUESTION',
    GROUP_CHECKBOX_QUESTION = 'GROUP_CHECKBOX_QUESTION',
    RADIO = 'RADIO',
    CHECKBOX = 'CHECKBOX',
    DROP_DOWN = 'DROP_DOWN',
    FILE_UPLOAD = 'FILE_UPLOAD',
    LINEAR_SCALE = 'LINEAR_SCALE',
    RATING = 'RATING',
    GROUP = 'GROUP',
    DATE = 'DATE',
    STATEMENT = 'STATEMENT',
    RANKING = 'RANKING'
}

enum AttachmentType {
    IMAGE = 'image',
    VIDEO = 'video'
}

enum VideoEmbedProvider {
    YOUTUBE = 'youtube',
    VIMEO = 'vimeo'
}

//TODO: fetch the data using api slice and set the form...
// you will need two api calls conditionally based on questions or responses.

export default function FormRenderer({ form }: any) {
    const getQuestionType = (question: any) => {
        if (question.isMediaContent && 'video' in question.type) return QUESTION_TYPE.VIDEO_CONTENT;
        if (question.isMediaContent && 'image' in question.type) return QUESTION_TYPE.IMAGE_CONTENT;
        if (question.isGroupQuestion && 'grid' in question.type) {
            if (question.type?.grid?.columns?.type === QUESTION_TYPE.RADIO) return QUESTION_TYPE.GROUP_RADIO_QUESTION;
            if (question.type?.grid?.columns?.type === QUESTION_TYPE.CHECKBOX) return QUESTION_TYPE.GROUP_CHECKBOX_QUESTION;
        }
        if (!!question.type && 'type' in question.type && question.type.type === 'GROUP') return QUESTION_TYPE.GROUP;
        if (!!question.type && 'paragraph' in question.type && !!question.type.paragraph) return QUESTION_TYPE.TEXT_AREA;
        if (!!question.type && 'type' in question.type && question.type.type === QUESTION_TYPE.RANKING) return QUESTION_TYPE.RANKING;
        if (!!question.type && 'type' in question.type && question.type.type === QUESTION_TYPE.INPUT_FIELD) return QUESTION_TYPE.INPUT_FIELD;
        if (!!question.type && 'type' in question.type && question.type.type === QUESTION_TYPE.DROP_DOWN) return QUESTION_TYPE.DROP_DOWN;
        if (!!question.type && 'type' in question.type && question.type.type === QUESTION_TYPE.RADIO) return QUESTION_TYPE.RADIO;
        if (!!question.type && 'type' in question.type && question.type.type === QUESTION_TYPE.CHECKBOX) return QUESTION_TYPE.CHECKBOX;
        if (!!question.type && 'type' in question.type && question.type.type === QUESTION_TYPE.RATING) return QUESTION_TYPE.RATING;
        if ('type' in question.type && question.type.type === QUESTION_TYPE.DATE) return QUESTION_TYPE.DATE;
        if (!!question.type && 'folderId' in question.type && !!question.type.folderId) return QUESTION_TYPE.FILE_UPLOAD;
        if ((!!question.type && 'high' in question.type) || (!!question.type && 'low' in question.type)) return QUESTION_TYPE.LINEAR_SCALE;
        if ('type' in question.type && question.type.type === 'STATEMENT') return QUESTION_TYPE.STATEMENT;
        return QUESTION_TYPE.INPUT_FIELD;
    };

    const renderGridRowColumns = (question: any, Component: any) => {
        const gridRowQuestions = question.type?.questions;
        const gridColumnOptions = question.type?.grid?.columns?.options;
        const gridColumnCount = question.type?.grid?.columns?.options && Array.isArray(question.type?.grid?.columns?.options) ? question.type?.grid?.columns?.options.length : 0;
        const gridAnswers = question.answer ? question.answer : [];

        return (
            <div className="" data-testid="form-renderer">
                <div className={`grid grid-flow-col grid-cols-${gridColumnCount + 1} gap-4`}>
                    <p></p>
                    {gridColumnOptions.map((gcp: any, idx: any) => (
                        <p key={idx} className="font-semibold">
                            {gcp?.value}
                        </p>
                    ))}
                </div>
                {gridRowQuestions.map((grq: any, idx: any) => {
                    return (
                        <div key={idx} className={`grid grid-flow-col grid-cols-${gridColumnCount + 1} gap-4`}>
                            <p className="font-semibold w-fit">{grq?.rowQuestion?.title}</p>
                            {gridColumnOptions.map((gcp: any, idx: any) => {
                                const handleCheckedAnswer = (gcp: any): boolean => {
                                    const questionId = grq?.questionId;
                                    let isSelected = false;
                                    gridAnswers.map((gra: any) => {
                                        if (!!gra?.questionId && gra?.questionId === questionId && gra?.answer && Array.isArray(gra.answer)) {
                                            gra.answer.map((a: any) => {
                                                if (!!a?.value && !!gcp?.value && a?.value === gcp?.value) isSelected = true;
                                            });
                                        }
                                    });
                                    return isSelected;
                                };

                                return (
                                    <div key={idx}>
                                        <Component checked={handleCheckedAnswer(gcp)} />
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };

    function renderYoutubeVideo(youtubeUri: string, description?: string) {
        const splitUriByEquals = youtubeUri.split('=');
        const strippedLink = splitUriByEquals.length > 1 ? splitUriByEquals[1] : null;
        const embedUrl = `https://www.youtube.com/embed/${strippedLink}`;
        return (
            <div className="w-full">
                {description && <MarkdownText description={description} contentStripLength={1000} markdownClassName="text-base text-grey" textClassName="text-base" />}
                {strippedLink && (
                    <div className="mt-3 relative w-full">
                        <iframe src={embedUrl} width="100%" className="min-h-[30vh] xs:min-h-[40vh] md:min-h-[50vh]" frameBorder="0" marginHeight={0} marginWidth={0}>
                            <Loader />
                        </iframe>
                    </div>
                )}
            </div>
        );
    }

    const renderQuestionTypeField = (question: StandardFormQuestionDto) => {
        const questionType: QUESTION_TYPE = getQuestionType(question);
        switch (questionType) {
            case QUESTION_TYPE.VIDEO_CONTENT:
                const youtubeUri = question?.type?.video?.youtubeUri;
                const description = question?.type?.caption;
                return youtubeUri && renderYoutubeVideo(youtubeUri, description);
            case QUESTION_TYPE.IMAGE_CONTENT:
                if (question?.type?.image?.contentUri)
                    return (
                        <div className="w-full">
                            <img src={question?.type?.image?.contentUri} width="100%" alt={question?.type?.image?.altText} />
                        </div>
                    );
                return <div className="w-full">{question?.type?.image?.altText && <MarkdownText description={question.type.image.altText} contentStripLength={1000} markdownClassName="text-base text-grey" textClassName="text-base" />}</div>;
            case QUESTION_TYPE.GROUP_RADIO_QUESTION:
                return renderGridRowColumns(question, Radio);
            case QUESTION_TYPE.GROUP_CHECKBOX_QUESTION:
                return renderGridRowColumns(question, Checkbox);
            case QUESTION_TYPE.RADIO:
                let radioOptions: any = [];
                if (question.type?.options && Array.isArray(question.type?.options)) {
                    radioOptions = [...question.type?.options];
                }
                const radioAnswers: any = question.answer ? question.answer : [];
                return (
                    <StyledTextField>
                        {radioOptions.map((option: any, idx: any) => (
                            <div key={idx} className="flex items-center gap-3">
                                {option?.attachment?.href && <img width={80} height={80} src={option?.attachment?.href} />}
                                <FormControlLabel control={<Radio checked={radioAnswers.includes(option?.value)} />} label={option?.value} />
                            </div>
                        ))}
                    </StyledTextField>
                );
            case QUESTION_TYPE.CHECKBOX:
                let checkboxOptions: any = [];
                if (question.type?.options && Array.isArray(question.type?.options)) {
                    checkboxOptions = [...question.type?.options];
                }
                const checkboxAnswers: any = question.answer ? question.answer : [];
                return (
                    <StyledTextField>
                        {checkboxOptions.map((option: any, idx: any) => (
                            <div key={idx} className="flex items-center gap-3">
                                {option?.attachment?.href && <img width={80} height={80} src={option?.attachment?.href} />}
                                <FormControlLabel control={<Checkbox checked={checkboxAnswers.includes(option?.value)} />} label={option?.value} />
                            </div>
                        ))}
                    </StyledTextField>
                );
            case QUESTION_TYPE.RANKING:
                if (!!question.answer) {
                    const answer = question.answer;
                    return (
                        <>
                            {answer.map((answer: any, idx: number) => {
                                return (
                                    <div key={idx} className="p-3 mt-3 mb-3 rounded-md border-[1px] border-gray-300">
                                        <span className="ml-2">
                                            {idx + 1}. {answer}
                                        </span>
                                    </div>
                                );
                            })}
                        </>
                    );
                } else {
                    const choices = question?.type?.options ?? [];
                    const choicesArray: Array<number> = [];
                    for (let i = 0; i < choices.length; i++) {
                        choicesArray.push(i + 1);
                    }
                    return (
                        <>
                            {choices.map((choice: any, idx: number) => {
                                return (
                                    <div key={idx} className="p-3 mt-3 mb-3 rounded-md border-[1px] border-gray-300">
                                        <Select defaultValue={''} className="h-6" value={''}>
                                            {choicesArray.map((dd: number) => (
                                                <MenuItem key={dd} value={''}>
                                                    {dd}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <span className="ml-2">{choice.value}</span>
                                    </div>
                                );
                            })}
                        </>
                    );
                }
            case QUESTION_TYPE.TEXT_AREA:
                return (
                    <StyledTextField>
                        <TextareaAutosize value={question.answer} />
                    </StyledTextField>
                );
            case QUESTION_TYPE.DROP_DOWN:
                let dropdownOptions: any = [];
                if (question.type?.options && Array.isArray(question.type?.options)) {
                    dropdownOptions = [...question.type?.options];
                }
                const dropdownAnswers: any = question.answer ? question.answer : [];
                const dropdownAnswer = Array.isArray(dropdownAnswers) && dropdownAnswers.length !== 0 ? dropdownAnswers[0] : '';
                return (
                    <StyledTextField>
                        <Select defaultValue={''} value={dropdownAnswer}>
                            {dropdownOptions.map((dd: any, idx: any) => (
                                <MenuItem key={idx} value={dd?.value}>
                                    {dd?.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </StyledTextField>
                );
            case QUESTION_TYPE.FILE_UPLOAD:
                return (
                    <Button variant="solid" className="mt-3">
                        Upload File
                        <input type="file" hidden />
                    </Button>
                );
            case QUESTION_TYPE.RATING:
                const ratingAnswers: any = question.answer ? parseInt(question.answer) : 0;
                return <Rating name="size-large" size="large" defaultValue={ratingAnswers} precision={1} max={!!question.type.steps ? parseInt(question.type.steps) : 3} readOnly />;
            case QUESTION_TYPE.GROUP:
                const map = new Map();

                question.type.questions.map((q: any) => map.set(q.questionId, q));

                const questionsWithAnswersArray =
                    question?.answer?.map((a: any) => {
                        return { ...map.get(a.questionId), answer: a.answer };
                    }) ?? [];

                return (
                    <>
                        {questionsWithAnswersArray?.map((q: any, idx: number) => (
                            <div key={idx}>
                                <h1 className="text-gray-500 font-semibold mt-4">{q?.title}</h1>
                                {renderQuestionTypeField(q)}
                            </div>
                        ))}
                    </>
                );
            case QUESTION_TYPE.LINEAR_SCALE:
                const linearScaleLowValue = question.type?.low;
                const linearScaleHightValue = question.type?.high;
                const followerMarks = [];

                for (let i = linearScaleLowValue; i <= linearScaleHightValue; i++) {
                    followerMarks.push({ value: i, label: i });
                }

                const linearScaleAnswers: any = question.answer ? question.answer : [];
                const linearScaleAnswer = Array.isArray(linearScaleAnswers) && linearScaleAnswers.length !== 0 ? Number(linearScaleAnswers[0]) : undefined;

                return <Slider value={linearScaleAnswer} min={linearScaleLowValue} step={1} max={linearScaleHightValue} marks={followerMarks} />;
            case QUESTION_TYPE.DATE:
                const date_format = question.type?.date_format ?? 'MM/DD/YYYY';
                const answer = question.answer ?? '';
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="" renderInput={(params) => <TextField {...params} />} onChange={(e) => {}} inputFormat={date_format} value={answer} disabled={true} />
                    </LocalizationProvider>
                );
            case QUESTION_TYPE.STATEMENT:
                // Render no input element for statement
                return <></>;
            case QUESTION_TYPE.INPUT_FIELD:
            default:
                return (
                    <StyledTextField>
                        <TextField value={question.answer} fullWidth variant="standard" />
                    </StyledTextField>
                );
        }
    };

    function renderVimeoVideo(href: string) {
        const match = href.match(/https:\/\/vimeo\.com\/(\d+)/);
        if (match) {
            const videoId = match[1];
            return <iframe width="100%" height="550" src={`https://player.vimeo.com/video/${videoId}`} allow="autoplay; encrypted-media" />;
        } else {
            return <a href={href}>Click here to see video attachment.</a>;
        }
    }

    function renderVideoSource(href: string) {
        return (
            <div className="mt-2">
                <p className="text-gray-400">Couldn&apos;t display. Unsupported media type.</p>
                <a className="text-blue-500 mt-1" rel="noreferrer" target="_blank" href={href}>
                    Click here to see video attachment.
                </a>
            </div>
        );
    }

    function renderQuestionAttachment(attachment: any) {
        switch (attachment.type) {
            case AttachmentType.IMAGE:
                return <img className="attachment" src={attachment.href} alt={attachment.properties?.description} />;
            case AttachmentType.VIDEO:
                if (attachment?.href == null) break;
                const embed_provider = attachment.embed_provider;
                if (embed_provider == VideoEmbedProvider.YOUTUBE) return renderYoutubeVideo(attachment.href);
                else if (embed_provider == VideoEmbedProvider.VIMEO) return renderVimeoVideo(attachment.href);
                else return renderVideoSource(attachment.href);
            default:
                break;
        }
        return <p className="text-gray-300">Couldn&apos;t display media Unsupported Type.</p>;
    }

    return (
        <div data-testid="form-renderer" className="relative container mx-auto px-6 md:px-0">
            <div className="pb-14 pt-4">
                <h1 className="font-semibold text-darkGrey mb-3 text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-[40px]">{form?.title}</h1>
                {form?.description && (
                    <div className="p-6 border-[1.5px] border-gray-200 rounded-lg">
                        <MarkdownText description={form?.description} contentStripLength={1000} markdownClassName="text-base text-grey" textClassName="text-base" />
                    </div>
                )}
                <hr className="my-6" />
                {form?.questions?.map((question: any, idx: number) => (
                    <div key={question?.questionId ?? `${question.formId}_${idx}`} className="p-6 border-[1.5px] border-gray-200 rounded-lg mb-4">
                        <h1 className="font-semibold text-lg text-gray-600">{question.title}</h1>
                        {question?.description && <MarkdownText description={question.description} contentStripLength={1000} markdownClassName="text-base text-grey" textClassName="text-base" />}
                        {question.attachment && renderQuestionAttachment(question.attachment)}
                        {renderQuestionTypeField(question)}
                    </div>
                ))}
            </div>
        </div>
    );
}