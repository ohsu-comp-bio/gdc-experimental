#!/usr/bin/env python

"""Faker backend:
Leverages the gdc data dictionary
https://github.com/NCI-GDC/gdcdictionary
Leverages the ccc data dictionary
https://github.com/ohsu-computational-biology/gdc-experimental/tree/api2/schemas
"""
# for faker
from gdcdictionary import gdcdictionary
import cccschema

import os
import requests
from flask import Flask, request, jsonify, Response, json


def cccFakeResponse(schema_key, request):
    """ create a response object with random data based on jsonschema
    currently the schema_key values are:
    [u'Resource',
     u'Dataset',
     u'Project',
     u'Individual',
     u'BioSample',
     u'Program',]
    """
    return _callFaker(cccschema.json_schema(schema_key), request)


def gdcFakeResponse(schema_key, request):
    """ create a response object with random data based on jsonschema
    currently the schema_key values are:
    ['submitted_unaligned_reads',
     'somatic_mutation_calling_workflow',
     'pathology_report',
     'run_metadata',
     'read_group',
     'family_history',
     'publication',
     'aligned_reads_metric',
     'demographic',
     'platform',
     'data_subtype',
     'treatment',
     'biospecimen_supplement',
     'clinical',
     'alignment_cocleaning_workflow',
     'submitted_tangent_copy_number',
     'aliquot',
     'methylation_beta_value',
     'analysis_metadata',
     'masked_somatic_mutation',
     'annotated_somatic_mutation',
     'case',
     'submitted_aligned_reads',
     'simple_somatic_mutation',
     'filtered_copy_number_segment',
     'rna_expression_workflow',
     'aggregated_somatic_mutation',
     'project',
     'slide',
     'tissue_source_site',
     'germline_mutation_calling_workflow',
     'experiment_metadata',
     'program',
     'sample_level_maf',
     'sample',
     'tag',
     'analyte',
     'file',
     'simple_germline_variation',
     'somatic_aggregation_workflow',
     'slide_image',
     'archive',
     'read_group_qc',
     'mirna_expression',
     'submitted_methylation_beta_value',
     'somatic_annotation_workflow',
     'experimental_strategy',
     'data_type',
     'copy_number_segment',
     'aligned_reads',
     'copy_number_liftover_workflow',
     'aligned_reads_index',
     'methylation_liftover_workflow',
     'annotation',
     'exon_expression',
     'exposure',
     'gene_expression',
     'center',
     'alignment_workflow',
     'clinical_supplement',
     'data_format',
     'portion',
     'diagnosis',
     'mirna_expression_workflow']
    """
    return _callFaker(json.dumps(gdcdictionary.schema[schema_key]), request)


def _callFaker(json, request):
    """
    Given a json payload, call the faker backend.
    All request params are passed to faker
    returns a Response with the faker payload.
    """
    headers = {'content-type': 'application/json'}
    r = requests.post(os.environ['FAKER_URL'],
                      data=json,
                      headers=headers,
                      params=request.args)
    return Response(r.text, mimetype='application/json')
